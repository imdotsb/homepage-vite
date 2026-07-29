import { Button } from "@cloudflare/kumo/components/button";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "im-sb-theme";

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Toggles Kumo light/dark mode via the `data-mode` attribute on <html>.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.dataset.mode = dark ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <Button
      variant="ghost"
      shape="circle"
      icon={dark ? <SunIcon /> : <MoonIcon />}
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    />
  );
}
