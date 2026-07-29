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
      posts.push({ title: title || "Untitled post", link });
    }
  }
  return posts;
}

export function BlogCard() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(RSS_URL)
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
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-0.5">
            <Text variant="secondary" size="sm">
              Latest posts
            </Text>
            <Text as="h2" variant="heading3">
              Blog
            </Text>
          </div>
          <Link
            href="https://yjk.im.sb"
            target="_blank"
            rel="noopener noreferrer"
            variant="plain"
            className="flex shrink-0 items-center gap-1 text-sm text-kumo-link"
          >
            Visit
            <ArrowSquareOutIcon />
          </Link>
        </div>

        <div className="mt-3 grid gap-1">
          {posts === null && !failed && (
            <Text variant="secondary" size="sm">
              Loading latest posts...
            </Text>
          )}
          {failed && (
            <Text variant="secondary" size="sm">
              Could not load posts.
            </Text>
          )}
          {posts?.length === 0 && (
            <Text variant="secondary" size="sm">
              No posts found.
            </Text>
          )}
          {posts?.map((post) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2 hover:bg-kumo-tint"
            >
              <Text as="p" size="sm" bold truncate>
                {post.title}
              </Text>
            </a>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
