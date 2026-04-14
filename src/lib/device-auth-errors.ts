/**
 * Classify failures from device-auth DB / request handling into stable `error` strings
 * for JSON responses (desktop maps these to AGX-AUTH-* user codes).
 */

function messageOf(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

function pgCode(e: unknown): string | undefined {
  if (!e || typeof e !== "object") return undefined;
  const o = e as { code?: unknown };
  return typeof o.code === "string" ? o.code : undefined;
}

/**
 * Maps thrown values to `{ error, httpStatus }` for /api/auth/device/* routes.
 */
export function classifyDeviceAuthFailure(e: unknown): { error: string; httpStatus: number } {
  const msg = messageOf(e);
  const code = pgCode(e);

  if (
    (msg.includes("DATABASE_URL") && msg.includes("not set")) ||
    msg === "DATABASE_URL is not set"
  ) {
    return { error: "database_not_configured", httpStatus: 503 };
  }

  if (
    msg.includes("NEXT_PUBLIC_SUPABASE_URL") &&
    (msg.includes("SUPABASE_SERVICE_ROLE_KEY") || msg.includes("not configured"))
  ) {
    return { error: "supabase_not_configured", httpStatus: 503 };
  }

  // PostgreSQL: undefined_table
  if (code === "42P01" || /relation ["']?device_auth_requests["']? does not exist/i.test(msg)) {
    return { error: "database_schema_missing", httpStatus: 503 };
  }
  // PostgreSQL: undefined_object (enum / type missing)
  if (code === "42704" || /type ["']?device_auth_status["']? does not exist/i.test(msg)) {
    return { error: "database_schema_missing", httpStatus: 503 };
  }

  if (
    code === "28P01" ||
    /password authentication failed/i.test(msg) ||
    /no pg_hba.conf entry/i.test(msg)
  ) {
    return { error: "database_auth_failed", httpStatus: 503 };
  }

  if (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|getaddrinfo|Connection terminated unexpectedly/i.test(msg)
  ) {
    return { error: "database_connection_failed", httpStatus: 503 };
  }

  if (/self signed certificate|certificate verify failed|SSL|UNABLE_TO_VERIFY_LEAF_SIGNATURE/i.test(msg)) {
    return { error: "database_ssl_error", httpStatus: 503 };
  }

  return { error: "server_error", httpStatus: 500 };
}
