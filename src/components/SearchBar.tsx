import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { Select } from "@cloudflare/kumo/components/select";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { FormEvent } from "react";

const ENGINES = {
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
} as const;

type Engine = keyof typeof ENGINES;

const SEARCH_URLS: Record<Engine, string> = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
};

export function SearchBar() {
  const [engine, setEngine] = useState<Engine>("google");
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    window.open(SEARCH_URLS[engine] + encodeURIComponent(q), "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl gap-2"
    >
      <Select
        aria-label="Search engine"
        className="w-36 shrink-0"
        value={engine}
        onValueChange={(value) => setEngine(value as Engine)}
        items={ENGINES}
      />
      <Input
        aria-label="Search query"
        type="search"
        placeholder="Search the web..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="min-w-0 flex-1"
      />
      <Button
        type="submit"
        variant="primary"
        shape="square"
        icon={<MagnifyingGlassIcon />}
        aria-label="Search"
      />
    </form>
  );
}
