"use client";

import { useEffect, useState } from "react";

import Button from "../Button";
import { FaPlus } from "react-icons/fa6";

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setPromptInstall(e);
      // Update UI notify the user they can install the PWA
      setSupportsPWA(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) {
      return;
    }
    // Show the install prompt
    promptInstall.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await promptInstall.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, clear it
    setPromptInstall(null);
  };

  return (
    supportsPWA && (
      <div className="flex md:flex-row flex-col justify-between items-center gap-4 p-4 mt-2">
        <p>Try out this web application on your phone! </p>
        <Button
          onClick={handleInstallClick}
          variant="secondary"
          className="px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          <span>Add to Home Screen</span>
        </Button>
      </div>
    )
  );
}
