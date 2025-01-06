"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  FaArrowRight,
  FaClock,
  FaMagnifyingGlass,
  FaStar,
} from "react-icons/fa6";

import Button from "../Button";

interface SearchBarProps {
  showSortKey?: boolean;
  showSortOrder?: boolean;
  showSortOptions?: boolean;
}

function SearchBar({ showSortOptions = false }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "MOST_RECENT";

  const sortKeyOptions = [
    {
      value: "MOST_RECENT",
      label: "Newest",
      icon: FaClock,
    },
  ];

  const recentSortKeyOptions = [
    {
      value: "MOST_VIEWED",
      label: "All Time",
    },
    {
      value: "MOST_VIEWED_LAST_7_DAYS",
      label: "This Week",
    },
    {
      value: "MOST_VIEWED_LAST_30_DAYS",
      label: "This Month",
    },
  ];

  const createQueryString = useCallback(
    (queryString: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      queryString.forEach(({ name, value }) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  function handleSort(key: string) {
    const queryString = createQueryString([
      { name: "sort", value: key },
      { name: "page", value: "1" },
    ]);
    router.push(`${pathname}?${queryString}`);
  }

  return (
    <form className="flex flex-col  rounded-xl">
      <div className="flex items-center h-12">
        <label className="relative w-full">
          <span className="sr-only">Search posts</span>

          <input
            defaultValue={search || ""}
            type="text"
            name="search"
            id="search"
            autoComplete="off"
            placeholder="Search posts"
            className="w-full px-4 py-3 pl-12 rounded-l-lg
              bg-gray-800 text-gray-300
              focus:outline-none focus:ring-0 focus:border-gray-300"
          />

          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <FaMagnifyingGlass className="h-4 w-4 text-gray-300" />
          </div>
        </label>

        <Button
          type="submit"
          className="flex items-center px-4 h-full rounded-r-lg"
        >
          <span className="hidden mr-0 md:block md:mr-2">Search</span>
          <FaArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {showSortOptions && (
        <div className="flex items-center gap-4 rounded-l-lg mt-4 rounded-lg">
          {/* <span>Sort by</span> */}

          <div className="flex items-center gap-2 flex-wrap ">
            <div className="flex items-center rounded-lg bg-gray-850 overflow-hidden shrink-0">
              <div className="flex items-center space-x-2 px-3 py-2">
                <FaStar className="h-4 w-4" />
                <span className="hidden sm:block">Popular</span>
              </div>

              {recentSortKeyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSort(option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 transition-colors 
              ${
                sort === option.value
                  ? "bg-suzuha-teal-500 hover:bg-suzuha-teal-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

            {sortKeyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSort(option.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors 
              ${
                sort === option.value
                  ? "bg-suzuha-teal-500 hover:bg-suzuha-teal-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* <div className="flex items-center space-x-2 mt-2">
        {showSortKey && (
          <Select
            placeholder="Sort by"
            className="grow max-w-[20rem]"
            options={[
              { value: "created_at", label: "Created At" },
              { value: "updated_at", label: "Updated At" },
            ]}
          />
        )}

        {showSortOrder && (
          <Select
            placeholder="Sort order"
            className="grow max-w-[20rem]"
            options={[
              { value: "created_at", label: "Created At" },
              { value: "updated_at", label: "Updated At" },
              { value: "title", label: "Title" },
              { value: "description", label: "Description" },
              { value: "category", label: "Category" },
              { value: "author", label: "Author" },
            ]}
          />
        )}
      </div> */}
    </form>
  );
}

export default SearchBar;
