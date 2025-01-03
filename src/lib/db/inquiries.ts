import { sql } from "@/lib/db/neon";
import { InquiryData } from "@/types/api/inquiries";

import { Inquiry } from "@/types/inquiries";

export async function createInquiry(inquiry: Inquiry) {
  try {
    await sql(
      "INSERT INTO online_inquiries (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)",
      [
        inquiry.name,
        inquiry.email,
        inquiry.phone,
        inquiry.subject,
        inquiry.message,
      ]
    );
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
  const offset = ((page || 1) - 1) * (limit || 10);
  try {
    const result =
      await sql`SELECT * FROM online_inquiries ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const total = await sql`SELECT COUNT(*) FROM online_inquiries`;

    return {
      inquiries: result as InquiryData[],
      total: total[0].count,
      page: page || 1,
    };
  } catch (error) {
    console.error("Error getting inquiries:", error);
    throw error;
  }
}
