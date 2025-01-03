"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaBook,
  FaBusinessTime,
  FaCalendar,
  FaEye,
  FaMagnifyingGlass,
  FaPen,
} from "react-icons/fa6";

import Button from "../Button";
import Select from "../form/Select";
import { useCallback } from "react";

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
      icon: FaCalendar,
    },
    {
      value: "MOST_VIEWED",
      label: "Most viewed",
      icon: FaBook,
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
    <form className="flex flex-col p-4 bg-gray-850 rounded-xl">
      <div className="flex items-center h-12 rounded-l-lg">
        <label className="relative w-full">
          <span className="sr-only">Search posts</span>

          <input
            defaultValue={search || ""}
            type="text"
            name="search"
            id="search"
            autoComplete="off"
            placeholder="Search posts"
            className="w-full px-4 py-3 pl-12 rounded-lg
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
        <div
          className="flex items-center gap-4 rounded-l-lg mt-4 rounded-lg"
        >
          {/* <span>Sort by</span> */}

          <div className="flex items-center gap-2">
            {sortKeyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSort(option.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors 
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
