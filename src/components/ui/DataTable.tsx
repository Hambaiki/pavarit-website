"use client";

import { ReactNode } from "react";

import { FaQuestionCircle, FaSync } from "react-icons/fa";

import Button from "@/components/Button";
import Paginator from "@/components/Paginator";
import Spinner from "@/components/navigation/Spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

export interface ColumnDef<T> {
  header: string;
  render: (row: T) => ReactNode;
  minWidth?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  total: number;
  currentPage: number;
  limit?: number;
  onRetry?: () => void;
  className?: string;
}

function DataTable<T>({
  columns,
  data,
  loading,
  total,
  currentPage,
  limit = 10,
  onRetry,
  className,
}: DataTableProps<T>) {
  const paddedData: (T | undefined)[] =
    !loading && data.length > 0
      ? data.length < limit
        ? [...data, ...Array(limit - data.length).fill(undefined)]
        : data
      : [];

  return (
    <div className={className}>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <tr className="text-center text-gray-600 text-sm bg-gray-200">
              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className={`${col.minWidth ?? ""} ${col.className ?? ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {paddedData.length > 0 &&
              paddedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row &&
                    columns.map((col, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={`${col.minWidth ?? ""} ${col.className ?? ""}`}
                      >
                        {col.render(row)}
                      </TableCell>
                    ))}
                </TableRow>
              ))}

            {(loading || data.length === 0) && (
              <tr style={{ height: `${4 * limit}rem` }}>
                <td colSpan={columns.length} className="text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <FaQuestionCircle className="w-20 h-20 text-gray-600" />
                        <p className="text-xl text-gray-600">No data</p>
                        {onRetry && (
                          <Button
                            variant="secondary"
                            onClick={onRetry}
                            className="flex flex-row items-center gap-2 px-3 py-2 rounded-lg"
                          >
                            <FaSync className="w-4 h-4" />
                            Retry
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Paginator
          currentPage={currentPage}
          maxPage={Math.ceil(total / limit) || 1}
          shallow
        />
      </div>
    </div>
  );
}

export default DataTable;
