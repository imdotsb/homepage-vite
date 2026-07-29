import {
  BookmarkSimpleIcon,
  DotsThreeIcon,
  EnvelopeSimpleIcon,
  FileImageIcon,
  FilePdfIcon,
  GitBranchIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import data from "../../projects.json";

interface ProjectData {
  name: string;
  description: string;
  url: string;
  domain: string;
  /** Phosphor icon name, resolved via the ICONS map below. */
  icon: string;
}

export interface Project extends ProjectData {
  Icon: Icon;
}

const ICONS: Record<string, Icon> = {
  FileImage: FileImageIcon,
  FilePdf: FilePdfIcon,
  GitBranch: GitBranchIcon,
  ShieldCheck: ShieldCheckIcon,
  BookmarkSimple: BookmarkSimpleIcon,
  EnvelopeSimple: EnvelopeSimpleIcon,
  DotsThree: DotsThreeIcon,
};

/** Services are edited in `projects.json` at the project root. */
export const PROJECTS: Project[] = (data as ProjectData[]).map((project) => ({
  ...project,
  Icon: ICONS[project.icon] ?? DotsThreeIcon,
}));
