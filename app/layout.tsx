"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ClientEditOutline() {
  useEffect(() => {
    function hasEditParam(): boolean {
      if (typeof window === "undefined") return false;
      return window.location.search.includes("edit=true");
    }
    if (!hasEditParam()) return;
    let lastTarget: HTMLElement | null = null;
    let labelDiv: HTMLDivElement | null = null;
    const outlineClass = "___edit-outline-highlight";

    function getFriendlyLabel(tag: string): string {
      tag = tag.toLowerCase();
      if (
        [
          "div",
          "section",
          "main",
          "header",
          "footer",
          "article",
          "nav",
          "aside",
        ].includes(tag)
      )
        return "section";
      if (["p", "span"].includes(tag)) return "text";
      if (["a"].includes(tag)) return "link";
      if (["button"].includes(tag)) return "button";
      if (["input"].includes(tag)) return "input";
      if (["textarea"].includes(tag)) return "textarea";
      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) return "heading";
      if (["ul", "ol"].includes(tag)) return "list";
      if (["li"].includes(tag)) return "list item";
      if (["img"].includes(tag)) return "image";
      if (["form"].includes(tag)) return "form";
      if (["label"].includes(tag)) return "label";
      if (["select"].includes(tag)) return "dropdown";
      return tag;
    }

    function handleClick(e: MouseEvent) {
      if (!hasEditParam()) return;
      // Block native click actions and other handlers
      e.preventDefault();
      e.stopPropagation();
      type WithStopImmediate = MouseEvent & {
        stopImmediatePropagation: () => void;
      };
      if ("stopImmediatePropagation" in e)
        (e as WithStopImmediate).stopImmediatePropagation();

      let target = e.target as HTMLElement;
      if (!target) return;
      if (
        target.classList.contains("___edit-outline-label") &&
        target.parentElement
      ) {
        target = target.parentElement as HTMLElement;
      }
      if (target === document.body || target === document.documentElement)
        return;

      // Toggle selection on same element
      if (lastTarget && lastTarget === target) {
        lastTarget.classList.remove(outlineClass);
        if (labelDiv) {
          labelDiv.remove();
          labelDiv = null;
        }
        lastTarget = null;
        return;
      }

      // Clear previous selection
      if (lastTarget && lastTarget !== target) {
        lastTarget.classList.remove(outlineClass);
        if (labelDiv) {
          labelDiv.remove();
          labelDiv = null;
        }
      }

      // Select new element
      lastTarget = target;
      target.classList.add(outlineClass);
      if (!labelDiv) {
        labelDiv = document.createElement("div");
        labelDiv.className = "___edit-outline-label";
      }
      labelDiv.textContent = getFriendlyLabel(target.tagName);
      if (!target.contains(labelDiv)) target.appendChild(labelDiv);
    }

    document.body.addEventListener("click", handleClick, true);
    return () => {
      document.body.removeEventListener("click", handleClick, true);
    };
  }, []);
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientEditOutline />
        {children}
      </body>
    </html>
  );
}
