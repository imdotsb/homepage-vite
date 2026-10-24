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
}

function Stat({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="rounded-lg bg-kumo-tint px-3 py-2 text-center">
      <Text as="p" bold truncate>
        {value === null ? "--" : value.toLocaleString("zh-CN")}
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
    fetch("https://toots.social/nodeinfo/2.0")
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
            Mastodon
          </Text>
          <Link
            href="https://toots.social"
            target="_blank"
            rel="noopener noreferrer"
            variant="plain"
            className="flex shrink-0 items-center gap-1.5"
            aria-label="访问 toots.social"
          >
            {info !== null && (
              <Badge
                variant={info.openRegistrations ? "success" : "neutral"}
                appearance="dot"
              >
                {info.openRegistrations ? "开放注册" : "暂停注册"}
              </Badge>
            )}
            {failed && (
              <Badge variant="neutral" appearance="dot">
                状态不可用
              </Badge>
            )}
            <span className="text-kumo-subtle">
              <ArrowSquareOutIcon />
            </span>
          </Link>
        </div>
        <Text variant="secondary" size="sm" truncate>
          {failed
            ? "实例数据加载失败。"
            : info
              ? "分享、探索、交流，让社交网络重新回到你手中。"
              : "由 toots.social 托管的 Mastodon 实例"}
        </Text>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat value={info?.usage.users.total ?? null} label="用户" />
        <Stat value={info?.usage.localPosts ?? null} label="帖文" />
        <Stat
          value={info?.usage.users.activeMonth ?? null}
          label="月活跃"
        />
      </div>
    </BentoCard>
  );
}
