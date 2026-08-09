import { vi } from "vitest";

export interface QueryResult {
  data?: unknown;
  error?: unknown;
  count?: number | null;
}

export interface MockQuery {
  calls: Array<{ method: string; args: unknown[] }>;
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: (onFulfilled?: (value: Required<QueryResult>) => unknown, onRejected?: (reason: unknown) => unknown) => Promise<unknown>;
  [key: string]: unknown;
}

const CHAIN_METHODS = [
  "select",
  "insert",
  "update",
  "upsert",
  "delete",
  "eq",
  "neq",
  "is",
  "in",
  "gt",
  "gte",
  "lt",
  "lte",
  "like",
  "ilike",
  "match",
  "textSearch",
  "order",
  "limit",
  "range",
] as const;

/** Chainable Supabase query builder stub: every filter returns itself and awaiting it resolves to `result`. */
export function createQuery(result: QueryResult = {}): MockQuery {
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const resolved = { data: null, error: null, count: null, ...result } as Required<QueryResult>;
  const query = { calls } as MockQuery;

  for (const method of CHAIN_METHODS) {
    query[method] = vi.fn((...args: unknown[]) => {
      calls.push({ method, args });
      return query;
    });
  }
  for (const method of ["single", "maybeSingle"]) {
    query[method] = vi.fn((...args: unknown[]) => {
      calls.push({ method, args });
      return Promise.resolve(resolved);
    });
  }
  query.then = (onFulfilled, onRejected) => Promise.resolve(resolved).then(onFulfilled, onRejected);

  return query;
}

export interface SupabaseMockOptions {
  /** Authenticated user returned by `auth.getUser()`, or null for anonymous. */
  user?: { id: string } | null;
  /** Per-table results. An array is consumed one entry per `from(table)` call; the last entry repeats. */
  tables?: Record<string, QueryResult | QueryResult[]>;
  /** Errors returned by `auth.*` methods, keyed by method name. */
  authErrors?: Record<string, unknown>;
}

export interface MockAuth {
  getUser: ReturnType<typeof vi.fn>;
  getSession: ReturnType<typeof vi.fn>;
  signInWithPassword: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
  signInWithOAuth: ReturnType<typeof vi.fn>;
  resetPasswordForEmail: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
}

export interface SupabaseMock {
  client: {
    from: ReturnType<typeof vi.fn>;
    auth: MockAuth;
  };
  from: ReturnType<typeof vi.fn>;
  auth: MockAuth;
  /** Query builders created per table, in call order. */
  queries: Record<string, MockQuery[]>;
  /** First (or nth) builder created for a table. */
  queryFor: (table: string, index?: number) => MockQuery;
}


export function createSupabaseMock(options: SupabaseMockOptions = {}): SupabaseMock {
  const { user = { id: "user-1" }, tables = {}, authErrors = {} } = options;
  const queries: Record<string, MockQuery[]> = {};
  const pending: Record<string, QueryResult[]> = {};

  for (const [table, result] of Object.entries(tables)) {
    pending[table] = Array.isArray(result) ? [...result] : [result];
  }

  const from = vi.fn((table: string) => {
    const queue = pending[table] ?? [];
    const result = queue.length > 1 ? (queue.shift() as QueryResult) : (queue[0] ?? {});
    const query = createQuery(result);
    (queries[table] ??= []).push(query);
    return query;
  });

  const authMethod = (name: string) => vi.fn(() => Promise.resolve({ data: {}, error: authErrors[name] ?? null }));
  const auth: MockAuth = {
    getUser: vi.fn(() => Promise.resolve({ data: { user }, error: null })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: user ? { user } : null }, error: null })),
    signInWithPassword: authMethod("signInWithPassword"),
    signUp: authMethod("signUp"),
    signInWithOAuth: authMethod("signInWithOAuth"),
    resetPasswordForEmail: authMethod("resetPasswordForEmail"),
    updateUser: authMethod("updateUser"),
    signOut: authMethod("signOut"),
  };

  const client = { from, auth };

  return {
    client,
    from,
    auth,
    queries,
    queryFor: (table: string, index = 0) => {
      const query = queries[table]?.[index];
      if (!query) throw new Error(`No query recorded for table "${table}" at index ${index}`);
      return query;
    },
  };
}

/** Arguments a chainable method was called with, e.g. `argsOf(query, "eq")` -> [["id", "1"]]. */
export function argsOf(query: MockQuery, method: string): unknown[][] {
  return query.calls.filter((call) => call.method === method).map((call) => call.args);
}
