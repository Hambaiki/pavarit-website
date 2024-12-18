import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

import {
  getMaintenanceStatus,
  updateMaintenanceStatus,
} from "@/lib/db/maintenance";

export async function GET() {
  try {
    const status = await getMaintenanceStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    // Check if user is admin
    const roles = session?.user[
      `${process.env.AUTH0_AUDIENCE}/roles`
    ] as string[];
    const isAdmin = roles?.includes("admin");

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate the request body
    const settings = {
      enabled: Boolean(body.enabled),
      start_time: body.startTime ? body.startTime : null,
      end_time: body.endTime ? body.endTime : null,
      message: body.message || null,
      allowed_ips: body.allowedIPs || [],
    };

    const updatedStatus = await updateMaintenanceStatus(settings);

    // Update environment variable for middleware
    process.env.MAINTENANCE_MODE = String(settings.enabled);

    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    return NextResponse.json(
      { error: "Failed to update maintenance status" },
      { status: 500 }
    );
  }
}
