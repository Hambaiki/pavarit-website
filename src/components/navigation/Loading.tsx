// import { FaSpinner } from "react-icons/fa6";

import Spinner from "./Spinner";

function Loading() {
  return (
    <div className="flex flex-col flex-auto h-full min-h-[35rem] items-center justify-center">
      <div className="flex flex-col flex-auto items-center justify-center">
        {/* <FaSpinner className="text-neutral-300 w-16 h-20 mb-4 animate-spin" /> */}

        <Spinner />
      </div>
    </div>
  );
}

export default Loading;
