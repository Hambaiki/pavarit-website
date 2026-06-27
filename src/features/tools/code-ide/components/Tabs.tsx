"use client";

import { FaXmark } from "react-icons/fa6";

interface OpenTab {
  path: string;
  name: string;
  dirty: boolean;
}

interface TabsProps {
  tabs: OpenTab[];
  activePath: string | null;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}

export default function Tabs({
  tabs,
  activePath,
  onSelect,
  onClose,
}: TabsProps) {
  if (tabs.length === 0) {
    return (
      <div className="flex items-center px-4 h-9 text-xs text-gray-500 border-b border-white/10 shrink-0">
        No file open
      </div>
    );
  }

  return (
    <div className="flex items-stretch h-9 border-b border-white/10 overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const active = tab.path === activePath;
        return (
          <div
            key={tab.path}
            onClick={() => onSelect(tab.path)}
            title={tab.path}
            className={`group flex items-center gap-2 px-3 text-xs border-r border-white/10 cursor-pointer whitespace-nowrap shrink-0 ${
              active
                ? "bg-gray-950 text-white"
                : "bg-transparent text-gray-400 hover:bg-white/5"
            }`}
          >
            <span>{tab.name}</span>
            {tab.dirty ? (
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:hidden" />
            ) : null}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.path);
              }}
              className={`${
                tab.dirty ? "hidden group-hover:block" : "block"
              } text-gray-500 hover:text-white`}
            >
              <FaXmark className="w-2.5 h-2.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
