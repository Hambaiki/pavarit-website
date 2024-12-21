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

export async function POST(req: NextRequest) {
  try {
    try {
      const ip = req.headers.get("x-forwarded-for") || "";
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

    const inquiry: CreateInquiryRequest = await req.json();
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

export async function GET(_: NextRequest) {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json({
      success: true,
      message: "Inquiries fetched",
      inquiries,
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
