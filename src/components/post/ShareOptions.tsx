"use client";

import { FaFacebook, FaLink, FaLinkedin, FaTwitter } from "react-icons/fa6";

import Card from "@/components/ui/Card";

function ShareOptions() {
  const options = [
    {
      title: "Share on Facebook",
      icon: FaFacebook,
      onShare: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          "_blank"
        );
      },
    },
    {
      title: "Share on Twitter",
      icon: FaTwitter,
      onShare: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
          "_blank"
        );
      },
    },
    {
      title: "Share on LinkedIn",
      icon: FaLinkedin,
      onShare: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
          "_blank"
        );
      },
    },
    {
      title: "Copy Link",
      icon: FaLink,
      onShare: () => {
        navigator.clipboard.writeText(window.location.href);
      },
    },
  ];

  return (
    <Card className="space-y-3 p-4">
      <p className="text-sm">Like this post?</p>
      {options.map((option) => (
        <button
          key={option.title}
          className="flex flex-row items-center space-x-2 hover:text-primary-500 transition-colors"
          onClick={option.onShare}
        >
          <option.icon className="w-4 h-4" />
          <span className="text-sm">{option.title}</span>
        </button>
      ))}
    </Card>
  );
}

export default ShareOptions;
