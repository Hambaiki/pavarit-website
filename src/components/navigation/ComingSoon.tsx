import { FaPersonWalking } from "react-icons/fa6";

function ComingSoon() {
  return (
    <div className="flex flex-col flex-auto h-full min-h-[35rem] items-center justify-center">
      <div className="flex flex-col flex-auto items-center justify-center">
        <FaPersonWalking className="text-gray-300 w-32 h-32 mb-4" />
        <p className="text-center text-gray-300">Coming soon...</p>
      </div>
    </div>
  );
}

export default ComingSoon;
