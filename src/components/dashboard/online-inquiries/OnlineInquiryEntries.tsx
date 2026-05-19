"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { FaSync } from "react-icons/fa";

import Button from "@/components/Button";
import { ColumnDef } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/cn";
import { InquiryData } from "@/types/api/inquiries";

interface OnlineInquiryEntriesProps {
  className?: string;
}

const columns: ColumnDef<InquiryData>[] = [
  {
    header: "Created At",
    minWidth: "min-w-32",
    render: (row) =>
      row.created_at ? (
        <>
          {new Date(row.created_at).toLocaleDateString()}
          <br />
          {new Date(row.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </>
      ) : (
        "N/A"
      ),
  },
  { header: "Name", minWidth: "min-w-40", render: (row) => row.name },
  { header: "Email", minWidth: "min-w-40", render: (row) => row.email },
  { header: "Phone", minWidth: "min-w-32", render: (row) => row.phone },
  { header: "Subject", minWidth: "min-w-32", render: (row) => row.subject },
  {
    header: "Message",
    minWidth: "min-w-80",
    render: (row) => row.message,
  },
];

function OnlineInquiryEntries({ className }: OnlineInquiryEntriesProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);

  useEffect(() => {
    fetchInquiries(page);
  }, [page]);

  async function fetchInquiries(page: number) {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify({ page, limit, settings: {} }),
      });
      const data = await response.json();
      setInquiries(data.inquiries);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-row items-center justify-between">
        <h3>Inquiries</h3>
        <Button
          variant="secondary"
          onClick={() => fetchInquiries(page)}
          className="flex flex-row items-center gap-2 px-3 py-2 rounded-lg"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={inquiries}
        loading={loading}
        total={total}
        currentPage={page}
        limit={limit}
        onRetry={() => fetchInquiries(page)}
      />
    </div>
  );
}

export default OnlineInquiryEntries;
