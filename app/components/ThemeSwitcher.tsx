"use client";

import { useEffect, useState } from "react";

type Theme = "disco" | "dust" | "press";

const STORAGE_KEY = "pimpamtweet-theme";

const themes: { id: Theme; label: string; color: string }[] = [
  { id: "disco", label: "Disco", color: "#a78bfa" },
  { id: "dust", label: "Dust", color: "#d4a574" },
  { id: "press", label: "Press", color: "#a3a3a3" },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("disco");
  const [mounted, setMounted] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved && (saved === "disco" || saved === "dust" || saved === "press")) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    // Prevent transition flash on load
    document.documentElement.classList.add("no-transitions");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    });
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5">
        {themes.map((t) => (
          <div
            key={t.id}
            className="h-3 w-3 rounded-full opacity-30"
            style={{ backgroundColor: t.color }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Theme">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => handleThemeChange(t.id)}
          className={`
            group relative h-3 w-3 rounded-full transition-all duration-200
            ${theme === t.id 
              ? "scale-110 ring-1 ring-offset-1 ring-offset-background" 
              : "opacity-40 hover:opacity-70 hover:scale-105"
            }
          `}
          style={{ 
            backgroundColor: t.color,
            ringColor: theme === t.id ? t.color : undefined
          }}
          role="radio"
          aria-checked={theme === t.id}
          aria-label={t.label}
          title={t.label}
        />
      ))}
    </div>
  );
}

