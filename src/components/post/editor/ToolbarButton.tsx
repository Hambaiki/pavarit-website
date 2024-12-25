import { ReactNode } from "react";

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-10 rounded 
        ${
          active
            ? "bg-gray-700 text-white"
            : "bg-gray-800 text-gray-200"
        } hover:bg-gray-600 transition-colors`}
    >
      {children}
    </button>
  );
}

export default ToolbarButton;
