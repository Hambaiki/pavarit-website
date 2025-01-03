import React from "react";
import { IconType } from "react-icons";

import Button from "@/components/Button";

interface SectionHeaderProps {
  title: string;
  icon?: IconType;
  optionButton?: {
    title: string;
    href: string;
  };
}

function SectionHeader({ title, icon, optionButton }: SectionHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center space-x-4">
      <div className="flex items-center space-x-2">
        {icon && icon({ className: "h-6 w-6 text-suzuha-teal-500" })}
        <h2>{title}</h2>
      </div>

      {optionButton && (
        <div className="flex justify-center">
          <Button
            href={optionButton.href}
            variant="secondary"
            className="px-3 py-2 rounded-full text-sm"
          >
            {optionButton.title}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
