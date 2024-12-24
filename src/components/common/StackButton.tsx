"use client";

import { FaBars } from "react-icons/fa";

interface StackButtonProps {
  onClick: () => void;
}

function StackButton({ onClick }: StackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
    >
      <FaBars className="w-6 h-6" />
    </button>
  );
}

export default StackButton;
