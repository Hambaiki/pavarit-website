"use client";

import { useEffect, useState } from "react";
import Button from "../Button";

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

  if (!supportsPWA) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="secondary"
      className="w-32 h-12 rounded-lg"
    >
      Install App
    </Button>
  );
}
