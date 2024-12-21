import { sql } from "@/lib/db/neon";

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

export async function getInquiries() {
  try {
    const inquiries = await sql("SELECT * FROM online_inquiries");
    return inquiries;
  } catch (error) {
    console.error("Error getting inquiries:", error);
  }
}
