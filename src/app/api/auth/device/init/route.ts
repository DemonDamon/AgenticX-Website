import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { deviceAuthRequests } from "@/db/schema";

export const runtime = "nodejs";

const DEVICE_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const TTL_MS = 5 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { device_id?: string };
    const deviceId = String(body?.device_id ?? "").trim();
    if (!DEVICE_ID_RE.test(deviceId)) {
      return NextResponse.json({ ok: false, error: "invalid device_id" }, { status: 400 });
    }

    const db = getDb();
    const expiresAt = new Date(Date.now() + TTL_MS);

    const existingRows = await db
      .select()
      .from(deviceAuthRequests)
      .where(eq(deviceAuthRequests.deviceId, deviceId))
      .limit(1);
    const existing = existingRows[0];

    if (existing) {
      await db
        .update(deviceAuthRequests)
        .set({
          status: "pending",
          expiresAt,
          accessToken: null,
          refreshToken: null,
          userId: null,
          userEmail: null,
          userDisplayName: null,
        })
        .where(eq(deviceAuthRequests.deviceId, deviceId));
    } else {
      await db.insert(deviceAuthRequests).values({
        deviceId,
        status: "pending",
        expiresAt,
      });
    }

    return NextResponse.json({ ok: true, expires_at: expiresAt.toISOString() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json({ ok: false, error: "database_not_configured" }, { status: 503 });
    }
    console.error("[auth/device/init]", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
