import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { deviceAuthRequests } from "@/db/schema";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";

export const runtime = "nodejs";

const DEVICE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!token) {
      return NextResponse.json({ ok: false, error: "missing_bearer_token" }, { status: 401 });
    }

    const body = (await req.json()) as { device_id?: string; refresh_token?: string };
    const deviceId = String(body?.device_id ?? "").trim();
    const refreshToken = String(body?.refresh_token ?? "").trim();

    if (!DEVICE_ID_RE.test(deviceId)) {
      return NextResponse.json({ ok: false, error: "invalid device_id" }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data?.user) {
      return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 401 });
    }

    const user = data.user;
    const email = user.email ?? "";
    const displayName =
      (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      email ||
      user.id;

    const db = getDb();
    const rows = await db
      .select()
      .from(deviceAuthRequests)
      .where(eq(deviceAuthRequests.deviceId, deviceId))
      .limit(1);
    const row = rows[0];

    if (!row) {
      return NextResponse.json({ ok: false, error: "unknown_device" }, { status: 404 });
    }

    if (row.status === "expired" || row.expiresAt.getTime() < Date.now()) {
      await db
        .update(deviceAuthRequests)
        .set({ status: "expired" })
        .where(eq(deviceAuthRequests.deviceId, deviceId));
      return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
    }

    await db
      .update(deviceAuthRequests)
      .set({
        status: "completed",
        userId: user.id as unknown as string,
        accessToken: token,
        refreshToken: refreshToken || null,
        userEmail: email || null,
        userDisplayName: displayName || null,
      })
      .where(eq(deviceAuthRequests.deviceId, deviceId));

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json({ ok: false, error: "database_not_configured" }, { status: 503 });
    }
    if (msg.includes("SUPABASE_SERVICE_ROLE_KEY") || msg.includes("NEXT_PUBLIC_SUPABASE_URL")) {
      return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
    }
    console.error("[auth/device/confirm]", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
