import { useState } from "react";

interface SwitchProps {
  on?: boolean;
  onChange?: (on: boolean) => void;
}

function Switch({ on, onChange }: SwitchProps) {
  const [isOn, setIsOn] = useState(on || false);

  function handleChange() {
    setIsOn(!isOn);
    onChange?.(!isOn);
  }

  return (
    <div
      className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
        isOn ? "bg-suzuha-teal-500" : "bg-neutral-400"
      }`}
      onClick={handleChange}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
}

export default Switch;
