import { count, desc } from "drizzle-orm";

import { InquiryData } from "@/types/api/inquiries";
import { Inquiry } from "@/types/inquiries";

import { db } from "./index";
import { onlineInquiries } from "./schema";

export async function createInquiry(inquiry: Inquiry) {
  try {
    await db.insert(onlineInquiries).values({
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
  }
}

export async function getInquiries({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<{
  inquiries: InquiryData[];
  total: number;
  page: number;
}> {
  const currentPage = page ?? 1;
  const currentLimit = limit ?? 10;
  const offset = (currentPage - 1) * currentLimit;

  try {
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(onlineInquiries)
        .orderBy(desc(onlineInquiries.created_at))
        .limit(currentLimit)
        .offset(offset),
      db.select({ count: count() }).from(onlineInquiries),
    ]);

    return {
      inquiries: rows.map((r) => ({
        id: String(r.id),
        name: r.name ?? "",
        email: r.email ?? "",
        phone: r.phone ?? "",
        subject: r.subject ?? "",
        message: r.message ?? "",
        created_at: r.created_at ?? null,
      })) satisfies InquiryData[],
      total: totalResult[0].count,
      page: currentPage,
    };
  } catch (error) {
    console.error("Error getting inquiries:", error);
    throw error;
  }
}
