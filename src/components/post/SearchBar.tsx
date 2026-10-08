import { FaArrowRight, FaMagnifyingGlass } from "react-icons/fa6";

import Button from "../Button";

function SearchBar({ search = "" }: { search?: string }) {
  return (
    <form action="/posts/all" method="get" className="flex flex-col rounded-xl">
      <div className="flex items-center h-12">
        <label className="relative w-full">
          <span className="sr-only">Search posts</span>
          <input
            defaultValue={search}
            type="text"
            name="search"
            id="search"
            autoComplete="off"
            placeholder="Search posts"
            className="w-full px-4 py-3 pl-12 rounded-l-lg
              bg-surface-raised text-content
              focus:outline-none focus:ring-0 focus:border-accent"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <FaMagnifyingGlass className="h-4 w-4 text-content-secondary" />
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
    </form>
  );
}

export default SearchBar;
