import { Badge } from "@cloudflare/kumo/components/badge";
import { Link } from "@cloudflare/kumo/components/link";
import { Text } from "@cloudflare/kumo/components/text";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { BentoCard } from "../BentoCard";

interface NodeInfo {
  usage: {
    users: { total: number; activeMonth: number };
    localPosts: number;
  };
  openRegistrations: boolean;
  metadata?: { nodeDescription?: string };
}

/** The node description may contain HTML markup — render it as plain text. */
function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function Stat({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="rounded-lg bg-kumo-tint px-3 py-2 text-center">
      <Text as="p" bold truncate>
        {value === null ? "--" : value.toLocaleString()}
      </Text>
      <Text variant="secondary" size="xs" as="p" truncate>
        {label}
      </Text>
    </div>
  );
}

export function MastodonCard() {
  const [info, setInfo] = useState<NodeInfo | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("https://imsb.app/nodeinfo/2.0")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data: NodeInfo) => {
        if (!cancelled) setInfo(data);
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch Mastodon info:", error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BentoCard className="sm:col-span-2">
      <div className="grid gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <Text as="h2" variant="heading3">
            im.sb Mastodon
          </Text>
          <Link
            href="https://imsb.app"
            target="_blank"
            rel="noopener noreferrer"
            variant="plain"
            className="flex shrink-0 items-center gap-1.5"
            aria-label="Visit imsb.app"
          >
            {info !== null && (
              <Badge
                variant={info.openRegistrations ? "success" : "neutral"}
                appearance="dot"
              >
                {info.openRegistrations ? "Open signups" : "Closed signups"}
              </Badge>
            )}
            {failed && (
              <Badge variant="neutral" appearance="dot">
                Status unavailable
              </Badge>
            )}
            <span className="text-kumo-subtle">
              <ArrowSquareOutIcon />
            </span>
          </Link>
        </div>
        <Text variant="secondary" size="sm" truncate>
          {failed
            ? "Failed to load instance data."
            : info
              ? stripHtml(info.metadata?.nodeDescription ?? "")
              : "A mastodon instance hosted by im.sb"}
        </Text>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat value={info?.usage.users.total ?? null} label="Users" />
        <Stat value={info?.usage.localPosts ?? null} label="Posts" />
        <Stat
          value={info?.usage.users.activeMonth ?? null}
          label="Active / month"
        />
      </div>
    </BentoCard>
  );
}
