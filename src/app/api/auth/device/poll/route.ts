import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { deviceAuthRequests } from "@/db/schema";

export const runtime = "nodejs";

const DEVICE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const deviceId = String(url.searchParams.get("device_id") ?? "").trim();
    if (!DEVICE_ID_RE.test(deviceId)) {
      return NextResponse.json({ ok: false, error: "invalid device_id" }, { status: 400 });
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(deviceAuthRequests)
      .where(eq(deviceAuthRequests.deviceId, deviceId))
      .limit(1);
    const row = rows[0];

    if (!row) {
      return NextResponse.json({ ok: true, status: "unknown" });
    }

    const now = Date.now();
    if (row.expiresAt.getTime() < now && row.status !== "completed") {
      await db
        .update(deviceAuthRequests)
        .set({ status: "expired" })
        .where(eq(deviceAuthRequests.deviceId, deviceId));
      return NextResponse.json({ ok: true, status: "expired" });
    }

    if (row.status !== "completed" || !row.accessToken) {
      return NextResponse.json({ ok: true, status: "pending" });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

    const payload = {
      ok: true,
      status: "completed" as const,
      access_token: row.accessToken,
      refresh_token: row.refreshToken ?? "",
      supabase_url: supabaseUrl,
      user: {
        id: row.userId ?? "",
        email: row.userEmail ?? "",
        display_name: row.userDisplayName ?? "",
      },
    };

    await db.delete(deviceAuthRequests).where(eq(deviceAuthRequests.deviceId, deviceId));

    return NextResponse.json(payload);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json({ ok: false, error: "database_not_configured" }, { status: 503 });
    }
    console.error("[auth/device/poll]", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
