import type { PostgrestError } from "@supabase/supabase-js";
import { logError } from "@/lib/logger";

/** Postgrest code returned by `.single()` when the query matched no rows. */
const NO_ROWS_CODE = "PGRST116";

export function isNoRowsError(error: PostgrestError): boolean {
  return error.code === NO_ROWS_CODE;
}

export class DataAccessError extends Error {
  readonly scope: string;
  readonly code: string;

  constructor(scope: string, error: PostgrestError) {
    super(`${scope}: ${error.message}`);
    this.name = "DataAccessError";
    this.scope = scope;
    this.code = error.code;
  }
}

type LogContext = Record<string, string | number | boolean | null | undefined>;

/** Logs a Postgrest error and builds the error to throw, so it is never silently swallowed. */
export function dbError(scope: string, error: PostgrestError, context?: LogContext): DataAccessError {
  logError(scope, error, context);
  return new DataAccessError(scope, error);
}
