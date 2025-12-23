"use client";

import { ReactNode } from "react";

type AnimatedPanelProps = {
  isOpen: boolean;
  children: ReactNode;
};

export default function AnimatedPanel({ isOpen, children }: AnimatedPanelProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        opacity: isOpen ? 1 : 0,
        marginTop: isOpen ? undefined : "-12px", // Collapse the space-y-3 gap when closed
        transition: "grid-template-rows 0.25s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease, margin 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

