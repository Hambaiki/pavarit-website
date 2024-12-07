import Link from "next/link";
import { FaQuestion } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white">
      {/* <FaQuestion className="text-suzuha-teal-500 text-8xl mb-8" /> */}

      <h1 className="text-6xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="text-suzuha-teal-500 hover:underline text-lg">
        Go back home
      </Link>
    </div>
  );
}
