"use client";

import { FaBars } from "react-icons/fa";

interface StackButtonProps {
  onClick: () => void;
}

function StackButton({ onClick }: StackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg bg-surface-raised hover:bg-surface-muted transition-colors"
    >
      <FaBars className="w-6 h-6" />
    </button>
  );
}

export default StackButton;
