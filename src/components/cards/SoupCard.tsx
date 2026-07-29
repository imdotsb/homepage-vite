import { cn } from "@cloudflare/kumo/utils";
import { ArrowClockwiseIcon, ArrowSquareOutIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { BentoCard } from "../BentoCard";

const FALLBACK_QUOTE = "有人一笑就很好看，你是一看就挺好笑。";

export function SoupCard() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.staticdn.net/soup");
      const data: { badsoup?: string } = await response.json();
      setQuote(data.badsoup ?? FALLBACK_QUOTE);
    } catch (error) {
      console.error("Failed to fetch bad soup:", error);
      setQuote(FALLBACK_QUOTE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQuote();
  }, [fetchQuote]);

  return (
    <BentoCard className="soup-gradient relative items-center justify-center text-center text-white ring-0 lg:row-span-2">
      <p className="text-sm text-white/60">今日毒鸡汤</p>
      <blockquote
        className={cn(
          "relative z-10 mt-3 text-base font-medium text-white/95 italic",
          loading && "opacity-60",
        )}
      >
        {quote ?? "加载中…"}
      </blockquote>

      <a
        href="https://www.7ed.net"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="查看 API 来源"
        className="absolute top-4 right-4 z-20 text-white/60 hover:text-white"
      >
        <ArrowSquareOutIcon size={16} />
      </a>
      <button
        type="button"
        onClick={() => void fetchQuote()}
        disabled={loading}
        aria-label="换一句"
        className="absolute right-4 bottom-4 z-20 cursor-pointer rounded-full p-1.5 text-white/60 hover:bg-white/15 hover:text-white disabled:opacity-50"
      >
        <ArrowClockwiseIcon
          size={18}
          className={cn(loading && "animate-spin")}
        />
      </button>
    </BentoCard>
  );
}
