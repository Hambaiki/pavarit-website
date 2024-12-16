import { NextRequest, NextResponse } from "next/server";

import {
  withMiddlewareAuthRequired,
  getSession,
} from "@auth0/nextjs-auth0/edge";

// Define route protection levels
const ROUTE_PROTECTION = {
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
  ADMIN: "admin",
};

// Mapping of routes to their protection levels
const routeProtectionLevels: Record<string, string> = {
  "/blog/create": ROUTE_PROTECTION.ADMIN,
  "/profile": ROUTE_PROTECTION.AUTHENTICATED,
  "/cms/posts": ROUTE_PROTECTION.ADMIN,
  "/cms/posts/create": ROUTE_PROTECTION.ADMIN,
  "/cms/posts/edit": ROUTE_PROTECTION.ADMIN,
  // Add more routes as needed
};

export default withMiddlewareAuthRequired(async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const protectionLevel = routeProtectionLevels[path];

  const res = NextResponse.next();

  if (protectionLevel === ROUTE_PROTECTION.PUBLIC) {
    return res;
  }

  const session = await getSession(req, res);

  if (
    protectionLevel === ROUTE_PROTECTION.AUTHENTICATED ||
    protectionLevel === ROUTE_PROTECTION.ADMIN
  ) {
    if (!session) {
      return NextResponse.redirect("/api/auth/login");
    }
  }

  if (protectionLevel === ROUTE_PROTECTION.ADMIN) {
    if (!session) {
      return NextResponse.redirect("/api/auth/login");
    }
    const roleNamespace = process.env.AUTH0_AUDIENCE;
    const isAdmin = session.user[`${roleNamespace}/roles`]?.includes("admin");

    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/unauthorized`, req.url));
    }
  }
});

export const config = {
  matcher: [
    "/profile",
    "/blog/create",
    "/cms/posts",
    "/cms/posts/create",
    "/cms/posts/edit",
  ],
};
