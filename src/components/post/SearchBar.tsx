"use client";

import { useSearchParams } from "next/navigation";

import { FaArrowRight, FaMagnifyingGlass } from "react-icons/fa6";

import Button from "../Button";

function SearchBar() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div className="flex flex-col">
      <form className="flex items-center h-12 rounded-l-lg">
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
            bg-gray-850 text-gray-300
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
      </form>
    </div>
  );
}

export default SearchBar;
