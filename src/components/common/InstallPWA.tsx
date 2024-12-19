"use client";

import { usePWAInstall } from "react-use-pwa-install";

import { FaPlus } from "react-icons/fa6";

import Button from "../Button";

export default function InstallPWA() {
  const install = usePWAInstall();

  return (
    install && (
      <Button
        id="installButton"
        variant="secondary"
        onClick={install}
        className="px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FaPlus />
        <span>Add to Home Screen</span>
      </Button>
    )
  );
}
