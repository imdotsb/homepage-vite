import { Link } from "@cloudflare/kumo/components/link";
import { Text } from "@cloudflare/kumo/components/text";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { BentoCard } from "../BentoCard";

interface Post {
  title: string;
  link: string;
}

const RSS_URL = "https://yxlog.com/feed.xml";
// yxlog.com 的 feed 没有返回 CORS 头，浏览器端直接 fetch 会被拦下，因此走跨域代理。
const CORS_PROXY = "https://cors.sevencdn.com/?";
const FEED_URL = `${CORS_PROXY}${encodeURIComponent(RSS_URL)}`;
const MAX_POSTS = 3;

function toHttpUrl(link: string): string | null {
  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function parsePosts(xml: string): Post[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const posts: Post[] = [];
  for (const item of Array.from(doc.querySelectorAll("item")).slice(
    0,
    MAX_POSTS,
  )) {
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const link = toHttpUrl(item.querySelector("link")?.textContent?.trim() || "");
    if (link) {
      posts.push({ title: title || "未命名文章", link });
    }
  }
  return posts;
}

export function BlogCard() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(FEED_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch RSS feed");
        return response.text();
      })
      .then((xml) => {
        if (!cancelled) setPosts(parsePosts(xml));
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch blog posts:", error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BentoCard className="sm:col-span-2">
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-0.5">
            <Text variant="secondary" size="sm">
              最新文章
            </Text>
          </div>
          <Link
            href="https://yjk.im.sb"
            target="_blank"
            rel="noopener noreferrer"
            variant="plain"
            className="flex shrink-0 items-center gap-1 text-sm text-kumo-link"
          >
            访问博客
            <ArrowSquareOutIcon />
          </Link>
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-1">
          {posts === null && !failed && (
            <Text variant="secondary" size="sm">
              正在加载最新文章…
            </Text>
          )}
          {failed && (
            <Text variant="secondary" size="sm">
              文章加载失败。
            </Text>
          )}
          {posts?.length === 0 && (
            <Text variant="secondary" size="sm">
              暂无文章。
            </Text>
          )}
          {posts?.map((post) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center rounded-lg px-3 hover:bg-kumo-tint"
            >
              <div className="min-w-0 flex-1">
                <Text as="p" size="sm" bold truncate>
                  {post.title}
                </Text>
              </div>
            </a>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
