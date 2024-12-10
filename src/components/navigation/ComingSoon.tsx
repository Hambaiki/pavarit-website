import { FaPersonWalking } from "react-icons/fa6";

function ComingSoon() {
  return (
    <div className="flex flex-col flex-auto h-full items-center justify-center">
      <div className="flex flex-col flex-auto items-center justify-center">
        <FaPersonWalking className="text-neutral-300 w-32 h-32 mb-4" />
        <p className="text-center text-neutral-300">Coming soon...</p>
      </div>
    </div>
  );
}

export default ComingSoon;
