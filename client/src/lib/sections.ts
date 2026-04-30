// client/src/lib/sections.ts
import { ScrollText, FileText, Sparkles, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Section = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const SECTIONS: Section[] = [
  {
    id: "exam1",
    title: "Exam 1 Content",
    description: "Practice material from Exam 1 chapters. Review topics covered in the first exam.",
    icon: ScrollText,
  },
  {
    id: "exam2",
    title: "Exam 2 Content",
    description: "Practice material from Exam 2 chapters. Review topics covered in the second exam.",
    icon: FileText,
  },
  {
    id: "new",
    title: "Final Content",
    description: "Material covered after Exam 2. Review topics for the upcoming final.",
    icon: Sparkles,
  },
  {
    id: "visualizations",
    title: "Concept Visualizations",
    description: "Interactive visualizations to build intuition for tricky concepts.",
    icon: Eye,
  },
];

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}
