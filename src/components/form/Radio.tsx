import React from "react";

interface RadioProps {
  id: string;
  name: string;
  value?: string;
  checked: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

const Radio = ({
  id,
  name,
  value,
  checked,
  onChange,
  className,
}: RadioProps) => {
  return (
    <div
      className={`inline-flex items-center cursor-pointer ${className}`}
      onClick={() => onChange?.(value || "")}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 border-2 border-agnos_primary_blue-200 rounded-full transition ${
            checked ? "bg-agnos_primary_blue-200" : "bg-white"
          }`}
        />
        <div
          className={`absolute inset-1 rounded-full transition ${
            checked ? "bg-agnos_primary_blue-500" : "bg-white"
          }`}
        />
      </div>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(value || "")}
        className="sr-only"
      />
    </div>
  );
};

export default Radio;
