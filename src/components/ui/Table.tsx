import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="card rounded-xl overflow-x-auto scrollbar-thin backdrop-blur-md">
      <table className={cn("w-full", className)} {...props} />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn(className)} {...props} />;
}

function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-gray-200", className)} {...props} />
  );
}

function TableFooter({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t border-gray-200 text-sm font-medium text-gray-600",
        className
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("h-16 transition-colors hover:bg-gray-50/50", className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-2 text-center text-sm font-semibold text-gray-600 bg-gray-200 whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-2 text-center text-sm text-gray-600", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <caption
      className={cn("mt-4 text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
