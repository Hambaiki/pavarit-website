import { NextRequest, NextResponse } from "next/server";

import {
  getMaintenanceStatus,
  updateMaintenanceStatus,
  deleteMaintenanceStatus,
  getAllMaintenanceStatuses,
} from "@/lib/db/maintenance";

import {
  MaintenanceResponse,
  CommonResponse,
  MaintenanceStatusesResponse,
} from "@/types/api/settings";

export async function GET() {
  try {
    const settings = await getMaintenanceStatus();
    return NextResponse.json({
      success: true,
      message: "Maintenance status fetched",
      settings,
    } as MaintenanceResponse);
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch maintenance status",
      } as CommonResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const settings = await request.json();
    await deleteMaintenanceStatus(settings);
    return NextResponse.json({
      success: true,
      message: "Maintenance status deleted",
    } as CommonResponse);
  } catch (error) {
    console.error("Error deleting maintenance status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete maintenance status",
      } as CommonResponse,
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { enabled, start_time, end_time, message, allowed_ips } =
      await request.json();

    await updateMaintenanceStatus({
      enabled,
      start_time,
      end_time,
      message,
      allowed_ips,
    });

    return NextResponse.json({
      success: true,
      message: "Maintenance status updated",
    } as CommonResponse);
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update maintenance status",
      } as CommonResponse,
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
      success: true,
      message: "Maintenance statuses fetched",
      statuses: statuses.statuses,
      total: statuses.total,
      page: statuses.page,
    } as MaintenanceStatusesResponse);
  } catch (error) {
    console.error("Error fetching all maintenance statuses:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch all maintenance statuses",
      } as CommonResponse,
      { status: 500 }
    );
  }
}
