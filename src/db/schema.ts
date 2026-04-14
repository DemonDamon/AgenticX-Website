import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const deviceAuthStatusEnum = pgEnum("device_auth_status", ["pending", "completed", "expired"]);

export const deviceAuthRequests = pgTable("device_auth_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: text("device_id").notNull().unique(),
  status: deviceAuthStatusEnum("status").notNull().default("pending"),
  userId: uuid("user_id"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  userEmail: text("user_email"),
  userDisplayName: text("user_display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type DeviceAuthRequest = typeof deviceAuthRequests.$inferSelect;
export type NewDeviceAuthRequest = typeof deviceAuthRequests.$inferInsert;
