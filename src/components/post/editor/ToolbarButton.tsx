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
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-10 rounded ${
        active ? "bg-neutral-700 text-white" : "bg-neutral-800 text-neutral-200"
      } hover:bg-neutral-600`}
    >
      {children}
    </button>
  );
}

export default ToolbarButton;
