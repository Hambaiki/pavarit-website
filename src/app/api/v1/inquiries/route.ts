import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { createInquiry, getInquiries } from "@/lib/db/inquiries";

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // Per 60 seconds
});

import {
  CreateInquiryRequest,
  CreateInquiryResponse,
  GetInquiriesResponse,
} from "@/types/api/inquiries";

export async function PUT(request: NextRequest) {
  try {
    try {
      const ip = request.headers.get("x-forwarded-for") || "";
      await rateLimiter.consume(ip);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests",
        } as CreateInquiryResponse,
        { status: 429 }
      );
    }

    const inquiry: CreateInquiryRequest = await request.json();
    await createInquiry({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
    });
    return NextResponse.json({
      success: true,
      message: "Inquiry created",
    } as CreateInquiryResponse);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json({
      success: false,
      message: "Error creating inquiry",
    } as CreateInquiryResponse);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { page, limit } = await request.json();

    const inquiries = await getInquiries({
      page: page || 1,
      limit: limit || 10,
    });
    return NextResponse.json({
      success: true,
      message: "Inquiries fetched",
      inquiries: inquiries.inquiries,
      total: inquiries.total,
      page: inquiries.page,
    } as GetInquiriesResponse);
  } catch (error) {
    console.error("Error getting inquiries:", error);
    return NextResponse.json({
      success: false,
      message: "Error getting inquiries",
      inquiries: [],
    } as GetInquiriesResponse);
  }
}
