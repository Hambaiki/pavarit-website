export interface CommonResponse {
  success: boolean;
  message: string;
}

export interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CreateInquiryResponse extends CommonResponse {}

export interface CreateInquiryRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface GetInquiriesResponse extends CommonResponse {
  inquiries: InquiryData[];
}
