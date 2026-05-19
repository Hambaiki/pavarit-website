"use client";

import { useCallback } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/cn";

import { Button } from "../ui";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  maxPage: number;
  shallow?: boolean;
  scroll?: boolean;
  scrollTo?: string;
}

export default function Pagination({
  currentPage,
  maxPage,
  shallow,
  scroll,
  scrollTo,
  className,
  ...props
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleClick = (pageNumber: number) => {
    const url =
      pathname +
      "?" +
      createQueryString("page", pageNumber.toString()) +
      (scrollTo ? `#${scrollTo}` : "");

    const navigate = shallow ? router.replace : router.push;

    navigate(url, { scroll });
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      {Array.from({ length: maxPage }, (_, i) => i + 1).map((page, index) => (
        <Button
          key={index}
          size="sm"
          variant={currentPage === page ? "gradient" : "solid"}
          className={cn(
            "flex justify-center items-center rounded-full",
            currentPage === page && "pointer-events-none"
          )}
          onClick={() => handleClick(Number(page))}
        >
          {page}
        </Button>
      ))}
    </div>
  );
}
