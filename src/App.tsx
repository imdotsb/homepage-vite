import { Text } from "@cloudflare/kumo/components/text";
import { HeartIcon } from "@phosphor-icons/react";
import { SearchBar } from "./components/SearchBar";
import { ThemeToggle } from "./components/ThemeToggle";
import { BingCard } from "./components/cards/BingCard";
import { BlogCard } from "./components/cards/BlogCard";
import { MastodonCard } from "./components/cards/MastodonCard";
import { ProjectCard } from "./components/cards/ProjectCard";
import { SoupCard } from "./components/cards/SoupCard";
import { WeatherCard } from "./components/cards/WeatherCard";
import { PROJECTS } from "./lib/projects";

function project(name: string) {
  const found = PROJECTS.find((p) => p.name === name);
  if (!found) throw new Error(`Unknown project: ${name}`);
  return found;
}

export default function App() {
  return (
    <div className="min-h-svh bg-kumo-canvas text-kumo-default">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Title and introduction */}
        <header className="relative mb-10 text-center">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <Text as="h1" variant="heading1">
            im.sb
          </Text>
          <div className="mt-2">
            <Text variant="secondary">
              A curated collection of services and tools.
            </Text>
          </div>
        </header>

        {/* Search */}
        <section className="mb-10 sm:mb-14">
          <SearchBar />
        </section>

        {/* Bento grid */}
        <main className="grid grid-cols-1 gap-4 sm:grid-flow-dense sm:grid-cols-2 sm:auto-rows-[216px] lg:grid-cols-4">
          <MastodonCard />
          <WeatherCard />
          <ProjectCard project={project("JPG")} />
          <BingCard />
          <ProjectCard project={project("PDF")} />
          <ProjectCard project={project("Git")} />
          <SoupCard />
          <ProjectCard project={project("Check")} />
          <ProjectCard project={project("Memos")} />
          <ProjectCard project={project("Temp Mail")} />
          <BlogCard />
          <ProjectCard project={project("7ED")} />
        </main>

        {/* Copyright */}
        <footer className="mt-12">
          <div className="flex items-center justify-center gap-1.5">
            <Text variant="secondary" size="sm">
              &copy; {new Date().getFullYear()} im.sb. Built with
            </Text>
            <span className="flex h-lh items-center text-sm text-kumo-danger">
              <HeartIcon weight="fill" />
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
