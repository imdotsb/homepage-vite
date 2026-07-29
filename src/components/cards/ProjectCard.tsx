import { LinkButton } from "@cloudflare/kumo/components/button";
import { Text } from "@cloudflare/kumo/components/text";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { BentoCard, CardTitle } from "../BentoCard";
import type { Project } from "../../lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const Icon = project.Icon;

  return (
    <BentoCard>
      <div className="grid gap-1.5">
        <CardTitle icon={<Icon weight="duotone" />}>{project.name}</CardTitle>
        <Text variant="secondary" size="sm">
          {project.description}
        </Text>
      </div>
      <LinkButton
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="sm"
        className="mt-4 w-full justify-center"
      >
        {project.domain}
        <ArrowSquareOutIcon />
      </LinkButton>
    </BentoCard>
  );
}
