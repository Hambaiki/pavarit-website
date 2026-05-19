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
          active ? "bg-gray-300 text-gray-900" : "bg-gray-200 text-gray-700"
        } hover:bg-gray-300 transition-colors`}
    >
      {children}
    </button>
  );
}

export default ToolbarButton;
