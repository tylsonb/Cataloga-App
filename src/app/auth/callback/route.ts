import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      logError("auth.callback.exchangeCodeForSession", error);
      const url = new URL("/login", requestUrl.origin);
      url.searchParams.set("error", "auth_callback_failed");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
