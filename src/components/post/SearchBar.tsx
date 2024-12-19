"use client";

import { useSearchParams } from "next/navigation";

import { FaArrowRight, FaMagnifyingGlass } from "react-icons/fa6";

import Button from "../Button";

function SearchBar() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div className="flex flex-col p-4 bg-neutral-900 rounded-xl">
      <form className="flex items-center space-x-4 h-12">
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
            bg-neutral-800 text-neutral-300
            focus:outline-none focus:ring-0 focus:border-neutral-300"
          />

          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <FaMagnifyingGlass className="h-4 w-4 text-neutral-300" />
          </div>
        </label>

        <Button
          type="submit"
          className="flex items-center px-4 h-full rounded-lg"
        >
          <span className="hidden mr-0 md:block md:mr-2">Search</span>
          <FaArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;
