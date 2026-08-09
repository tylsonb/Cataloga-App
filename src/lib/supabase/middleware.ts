import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { logError } from "@/lib/logger";
import { isNoRowsError } from "@/lib/errors";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // A missing session is expected for anonymous visitors; anything else is a real failure.
  if (userError && userError.status !== 401 && userError.name !== "AuthSessionMissingError") {
    logError("middleware.getUser", userError, { pathname });
  }

  const protectedRoutes = ["/favoritos", "/perfil", "/dashboard", "/negocio/crear"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/login", "/registro", "/recuperar-password"];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError && !isNoRowsError(roleError)) {
      logError("middleware.adminRoleLookup", roleError, { userId: user.id, pathname });
    }

    if (roleData?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  supabaseResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return supabaseResponse;
}
