import { NextRequest, NextResponse } from "next/server";

import {
  getMaintenanceStatus,
  updateMaintenanceStatus,
  deleteMaintenanceStatus,
  getAllMaintenanceStatuses,
} from "@/lib/db/maintenance";

export async function GET() {
  try {
    const settings = await getMaintenanceStatus();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const settings = await request.json();
    await deleteMaintenanceStatus(settings);
    return NextResponse.json({ message: "Maintenance status deleted" });
  } catch (error) {
    console.error("Error deleting maintenance status:", error);
    return NextResponse.json(
      { error: "Failed to delete maintenance status" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { enabled, start_time, end_time, message, allowed_ips } =
      await request.json();
    const settings = await updateMaintenanceStatus({
      enabled,
      start_time,
      end_time,
      message,
      allowed_ips,
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    return NextResponse.json(
      { error: "Failed to update maintenance status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { page, limit } = await request.json();
    const statuses = await getAllMaintenanceStatuses({
      page: page || 1,
      limit: limit || 10,
    });
    return NextResponse.json({
      statuses: statuses.statuses,
      total: statuses.total,
      page: statuses.page,
    });
  } catch (error) {
    console.error("Error fetching all maintenance statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch all maintenance statuses" },
      { status: 500 }
    );
  }
}
