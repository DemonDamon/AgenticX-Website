CREATE TYPE "public"."device_auth_status" AS ENUM ('pending', 'completed', 'expired');

CREATE TABLE "device_auth_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "device_id" text NOT NULL,
  "status" "device_auth_status" DEFAULT 'pending' NOT NULL,
  "user_id" uuid,
  "access_token" text,
  "refresh_token" text,
  "user_email" text,
  "user_display_name" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "expires_at" timestamptz NOT NULL,
  CONSTRAINT "device_auth_requests_device_id_unique" UNIQUE ("device_id")
);
