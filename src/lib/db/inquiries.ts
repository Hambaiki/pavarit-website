import { count, desc } from "drizzle-orm";

import { db } from "./index";
import { Inquiry, inquiries } from "./schema";

export async function createInquiry(
  inquiry: Omit<Inquiry, "id" | "createdAt" | "updatedAt">
) {
  try {
    await db.insert(inquiries).values({
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
  data: Inquiry[];
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
        .from(inquiries)
        .orderBy(desc(inquiries.createdAt))
        .limit(currentLimit)
        .offset(offset),
      db.select({ count: count() }).from(inquiries),
    ]);

    return {
      data: rows as Inquiry[],
      total: totalResult[0].count,
      page: currentPage,
    };
  } catch (error) {
    console.error("Error getting inquiries:", error);
    throw error;
  }
}
