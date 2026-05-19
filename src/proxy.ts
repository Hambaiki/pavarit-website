import { NextRequest, NextResponse } from "next/server";

import { computeSessionToken } from "./lib/auth";
import { getMaintenanceStatus } from "./lib/db/maintenance";

const BYPASS_ROUTES = ["/api", "/_next", "/images"];

const MAINTENANCE_BYPASS_ROUTES = [
  "/api",
  "/login",
  "/maintenance",
  "/dashboard",
];

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

  // Skip maintenance check for these routes
  if (MAINTENANCE_BYPASS_ROUTES.some((r) => path.startsWith(r))) return res;

  // Maintenance mode check
  try {
    const maintenance = await getMaintenanceStatus();

    if (maintenance?.enabled) {
      const now = new Date();
      if (maintenance.start_time && maintenance.end_time) {
        const startTime = new Date(maintenance.start_time);
        const endTime = new Date(maintenance.end_time);
        if (now < startTime || now > endTime) return res;
      }

      const clientIP = request.headers.get("x-forwarded-for");
      if (clientIP && maintenance.allowed_ips?.includes(clientIP)) return res;

      if (await isAuthenticated(request)) return res;

      const maintenancePage = new URL("/maintenance", request.url);
      maintenancePage.searchParams.set("message", maintenance.message || "");
      return NextResponse.redirect(maintenancePage);
    }
  } catch (error) {
    console.error("Failed to fetch maintenance status:", error);
  }

  return res;
}

export const config = {
  matcher: ["/((?!api/maintenance|_next/static|_next/image|favicon.ico).*)"],
};
