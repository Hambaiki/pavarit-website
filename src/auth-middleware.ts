import { NextRequest, NextResponse } from "next/server";
import {
  withMiddlewareAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0/edge";

// Define protection levels
const ROUTE_PROTECTION = {
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
  ADMIN: "admin",
};

// Route protection mapping
const routeProtectionLevels: Record<string, string> = {
  "/blog/create": ROUTE_PROTECTION.ADMIN,
  "/profile": ROUTE_PROTECTION.AUTHENTICATED,
  "/dashboard/posts": ROUTE_PROTECTION.ADMIN,
  "/dashboard/posts/create": ROUTE_PROTECTION.ADMIN,
  "/dashboard/posts/edit": ROUTE_PROTECTION.ADMIN,
  "/dashboard": ROUTE_PROTECTION.ADMIN,
  // Add more routes as needed
};

export default withMiddlewareAuthRequired(async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const res = NextResponse.next();

  // Route protection check
  const protectionLevel = routeProtectionLevels[path];

  if (protectionLevel) {
    const session = await getSession(request, res);
    const roleNamespace = process.env.AUTH0_AUDIENCE;
    const isAdmin = session?.user[`${roleNamespace}/roles`]?.includes("admin");

    if (
      protectionLevel === ROUTE_PROTECTION.AUTHENTICATED ||
      protectionLevel === ROUTE_PROTECTION.ADMIN
    ) {
      if (!session) {
        return NextResponse.redirect(new URL("/api/auth/login", request.url));
      }
    }

    // Admin check
    if (protectionLevel === ROUTE_PROTECTION.ADMIN) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return res;
});

// Update matcher to exclude API routes
export const config = {
  matcher: ["/profile", "/dashboard"],
};
