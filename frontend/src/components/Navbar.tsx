"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome } from "@tabler/icons-react";
import { LucideNotebookPen } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-600 dark:text-neutral-400" />
      ),
      href: "/",
    },

    {
      title: "Words",
      icon: (
        <LucideNotebookPen className="h-full w-full text-neutral-600 dark:text-neutral-400" />
      ),
      href: "/word",
    },
    {
      title: "FlashCards",
      icon: (
        <div className="relative h-full w-full">
          <Image src="/exam.png" alt="flashcard" fill />
        </div>
      ),
      href: "/flashcard",
    },
    {
      title: "Learn",
      icon: (
        <div className="relative h-full w-full">
          <Image src="/learn.png" alt="flashcard" fill />
        </div>
      ),
      href: "/learn",
    },
    {
      title: "Match",
      icon: (
        <div className="relative h-full w-full">
          <Image src="/match.png" alt="match" fill />
        </div>
      ),
      href: "/match",
    },
  ];
  return (
    <div className="fixed bottom-2 left-0 w-full z-1 flex justify-center">
      <FloatingDock
        desktopClassName="shadow-lg"
        mobileClassName="shadow-lg"
        items={links}
      />
    </div>
  );
}
