"use server";

import { createInquiry, getInquiries } from "@/lib/db/inquiries";
import { Inquiry } from "@/lib/db/schema";

export async function serverCreateInquiry(
  inquiry: Omit<Inquiry, "id" | "createdAt" | "updatedAt">
) {
  try {
    await createInquiry(inquiry);
    return {
      success: true,
      message: "Inquiry created",
    };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return {
      success: false,
      message: "Error creating inquiry",
    };
  }
}

export async function serverGetInquiries({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
} = {}) {
  try {
    const result = await getInquiries({ page, limit });
    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Error getting inquiries:", error);
    return {
      success: false,
      data: [],
      total: 0,
      page: 1,
    };
  }
}
