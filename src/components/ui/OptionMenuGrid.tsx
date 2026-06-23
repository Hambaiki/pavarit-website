import { ReactNode } from "react";

import { IconType } from "react-icons";

import Button from "@/components/Button";
import { cn } from "@/lib/cn";

export interface OptionMenuItem {
  title: string;
  description: string;
  action: string;
  href?: string;
  onClick?: () => void;
  icon?: IconType | ReactNode;
}

interface OptionMenuGridProps {
  items: OptionMenuItem[];
  className?: string;
}

function OptionMenuGrid({ items, className }: OptionMenuGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="card rounded-xl flex flex-col gap-4 p-5 backdrop-blur-md"
        >
          {item.icon && (
            <div className="text-primary-500 text-2xl">
              {typeof item.icon === "function" ? <item.icon /> : item.icon}
            </div>
          )}

          <div className="flex-1 flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>

          <Button
            {...(item.href ? { href: item.href } : { onClick: item.onClick })}
            variant="secondary"
            className="w-full h-10 rounded-lg text-sm"
          >
            {item.action}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default OptionMenuGrid;
