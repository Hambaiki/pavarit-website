"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";

interface PaginatorProps {
  currentPage: number;
  maxPage: number;
  shallow?: boolean;
}

function Paginator({ currentPage, maxPage, shallow = false }: PaginatorProps) {
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
    // Update URL search params
    if (shallow) {
      router.replace(
        pathname + "?" + createQueryString("page", pageNumber.toString())
      );
    } else {
      router.push(
        pathname + "?" + createQueryString("page", pageNumber.toString())
      );
    }
  };

  const getPageNumbers = () => {
    const pages = [];

    if (maxPage <= 8) {
      // If maxPage is 8 or fewer, show all pages
      for (let i = 1; i <= maxPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 5) {
        // If current page is near the beginning
        pages.push(1, 2, 3, 4, 5, 6);
        pages.push("...");
        pages.push(maxPage);
      } else if (currentPage >= maxPage - 4) {
        // If current page is near the end
        pages.push(1);
        pages.push("...");
        for (let i = maxPage - 5; i <= maxPage; i++) {
          pages.push(i);
        }
      } else {
        // If current page is somewhere in the middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(maxPage);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center">
      <button
        disabled={currentPage == 1}
        className={`flex justify-center items-center h-10 w-10 rounded-lg transition-colors 
                  ${
                    currentPage == 1
                      ? "bg-gray-700 text-gray-300"
                      : "bg-suzuha-teal-500 hover:bg-suzuha-teal-600 text-white"
                  }`}
        onClick={() => handleClick(currentPage - 1)}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={index}
            className="h-12 w-12 flex justify-center items-center  
                      font-semibold text-xl text-primary_blue-200"
          >
            ...
          </span>
        ) : (
          <button
            key={index}
            className={`flex justify-center items-center h-10 w-10 rounded-lg transition-colors
              font-semibold text-xl 
              ${
                currentPage == page
                  ? "text-white hover:text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            onClick={() => handleClick(Number(page))}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage == maxPage}
        className={`flex justify-center items-center h-10 w-10 rounded-lg transition-colors 
                  ${
                    currentPage == maxPage
                      ? "bg-gray-700 text-gray-300"
                      : "bg-suzuha-teal-500 hover:bg-suzuha-teal-600 text-white"
                  }`}
        onClick={() => handleClick(currentPage + 1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

export default Paginator;
