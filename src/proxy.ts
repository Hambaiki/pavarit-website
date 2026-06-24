import { NextRequest, NextResponse } from "next/server";

import { computeSessionToken } from "./lib/auth";

const BYPASS_ROUTES = ["/api", "/_next", "/images"];

const PROTECTED_ROUTES = ["/dashboard"];

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) return false;
  const expected = await computeSessionToken();
  return token === expected;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const res = NextResponse.next();

  if (BYPASS_ROUTES.some((r) => path.startsWith(r))) return res;

  // Protect dashboard routes
  if (PROTECTED_ROUTES.some((r) => path === r || path.startsWith(r + "/"))) {
    if (!(await isAuthenticated(request))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
