"use client";

import React from "react";
import { FaFacebook, FaTwitter, FaLink, FaLinkedin } from "react-icons/fa6";

function ShareOptions() {
  const options = [
    {
      title: "Share on Facebook",
      icon: <FaFacebook />,
      onShare: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
          "_blank"
        );
      },
    },
    {
      title: "Share on Twitter",
      icon: <FaTwitter />,
      onShare: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${window.location.href}`,
          "_blank"
        );
      },
    },
    {
      title: "Share on LinkedIn",
      icon: <FaLinkedin />,
      onShare: () => {
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`,
          "_blank"
        );
      },
    },
    {
      title: "Copy Link",
      icon: <FaLink />,
      onShare: () => {
        navigator.clipboard.writeText(window.location.href);
      },
    },
  ];
  return (
    <div className="space-y-3 bg-neutral-900 rounded-xl p-4">
      <p className="text-sm text-neutral-300">Like this post?</p>
      {options.map((option) => (
        <button
          key={option.title}
          className="flex flex-row items-center space-x-2 hover:text-suzuha-teal-400 transition-colors"
          onClick={option.onShare}
        >
          {option.icon}
          <span className="text-sm">{option.title}</span>
        </button>
      ))}
    </div>
  );
}

export default ShareOptions;
