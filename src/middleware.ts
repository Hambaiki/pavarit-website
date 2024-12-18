import { NextRequest, NextResponse } from "next/server";
import { getMaintenanceStatus } from "./lib/db/maintenance";
import { getSession } from "@auth0/nextjs-auth0/edge";

// Routes that bypass all middleware checks
const BYPASS_ROUTES = [
  "/api/maintenance",
  "/api/v1", // All API v1 routes
  "/api/auth", // Auth routes
  "/maintenance",
  "/_next",
  "/images",
];

// const MAINTENANCE_BYPASS_ROUTES = ["/api", "/maintenance", "/dashboard"];

// Define protection levels for auth
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

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const res = NextResponse.next();

  // Check if route should bypass all middleware
  const shouldBypass = BYPASS_ROUTES.some((route) => path.startsWith(route));
  if (shouldBypass) return res;

  // 1. Check Maintenance Mode First
  try {
    const maintenance = await getMaintenanceStatus();

    if (maintenance?.enabled) {
      const now = new Date();
      if (maintenance.start_time && maintenance.end_time) {
        const startTime = new Date(maintenance.start_time);
        const endTime = new Date(maintenance.end_time);

        if (now < startTime || now > endTime) {
          return res;
        }
      }

      // IP Allowlist check
      const clientIP = request.ip || request.headers.get("x-forwarded-for");
      if (clientIP && maintenance.allowed_ips?.includes(clientIP)) {
        return res;
      }

      // Admin check
      const session = await getSession(request, res);
      if (session) {
        const roles = session.user[`${process.env.AUTH0_AUDIENCE}/roles`];
        if (roles?.includes("admin")) {
          return res;
        }
      }

      // Redirect to maintenance page
      const maintenancePage = new URL("/maintenance", request.url);
      maintenancePage.searchParams.set("message", maintenance.message || "");
      return NextResponse.redirect(maintenancePage);
    }
  } catch (error) {
    console.error("Failed to fetch maintenance status:", error);
  }

  // 2. Then Check Auth Protection
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
        const loginUrl = new URL("/api/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (protectionLevel === ROUTE_PROTECTION.ADMIN && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except those starting with:
     * - api/maintenance (maintenance API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/maintenance|_next/static|_next/image|favicon.ico).*)",
  ],
};
