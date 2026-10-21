import type { TechItem } from "../types/techstack.ts";

export const techItems = [
  { name: "Arch", type: "tech", icon: "/icons/simple-icons--archlinux.svg" },
  { name: "Elysia", type: "tech", icon: "/icons/simple-icons--elysia.svg" },
  { name: "Laravel", type: "tech", icon: "/icons/simple-icons--laravel.svg" },
  { name: "React", type: "tech", icon: "/icons/simple-icons--react.svg" },
  { name: "Tailwind", type: "tech", icon: "/icons/simple-icons--tailwindcss.svg" },
  { name: "Unity", type: "tech", icon: "/icons/simple-icons--unity.svg" },
  { name: "Clip Studio", type: "tech", icon: "/icons/simple-icons--clipstudiopaint.png" },
  { name: "Drizzle", type: "tech", icon: "/icons/simple-icons--drizzle.svg" },
  { name: "Docker", type: "tech", icon: "/icons/simple-icons--docker.svg" },
  { name: "Figma", type: "tech", icon: "/icons/simple-icons--figma.svg" },
  { name: "Alpine", type: "tech", icon: "/icons/simple-icons--alpinedotjs.svg" },
  { name: "TypeScript", type: "tech", icon: "/icons/simple-icons--typescript.svg" },
  { name: "three.js", type: "tech", icon: "/icons/simple-icons--threedotjs.svg" },
  { name: "Astro", type: "tech", icon: "/icons/simple-icons--astro.svg" },
  { name: "Aseprite", type: "tech", icon: "/icons/simple-icons--aseprite.svg" },
  { name: "C#", type: "tech", icon: "/icons/simple-icons--csharp.svg" },
  { name: "Blender", type: "tech", icon: "/icons/simple-icons--blender.svg" },
  { name: "CSS", type: "tech", icon: "/icons/simple-icons--css.svg" },
  { name: "Dlib", type: "tech", icon: "/icons/simple-icons--dlib.svg" },
  { name: "Flutter", type: "tech", icon: "/icons/simple-icons--flutter.svg" },
  { name: "HTML", type: "tech", icon: "/icons/simple-icons--html5.svg" },
  { name: "JavaScript", type: "tech", icon: "/icons/simple-icons--javascript.svg" },
  { name: "Spline", type: "tech", icon: "/icons/simple-icons--spline.svg" },
  { name: "Java", type: "tech", icon: "/icons/simple-icons--java.svg" },
  { name: "MySQL", type: "tech", icon: "/icons/simple-icons--mysql.svg" },
  { name: "Nginx", type: "tech", icon: "/icons/simple-icons--nginx.svg" },
  { name: "Photoshop", type: "tech", icon: "/icons/simple-icons--adobephotoshop.svg" },
  { name: "PHP", type: "tech", icon: "/icons/simple-icons--php.svg" },
  { name: "Python", type: "tech", icon: "/icons/simple-icons--python.svg" },
  { name: "Svelte", type: "tech", icon: "/icons/simple-icons--svelte.svg" },
  { name: "UnoCSS", type: "tech", icon: "/icons/simple-icons--unocss.svg" },
  { name: "Illustrator", type: "tech", icon: "/icons/simple-icons--adobeillustrator.svg" },
  { name: "Vue", type: "tech", icon: "/icons/simple-icons--vuedotjs.svg" },
  { name: "Postgre", type: "tech", icon: "/icons/simple-icons--postgresql.svg" },
  { name: "Supabase", type: "tech", icon: "/icons/simple-icons--supabase.svg" },
  { name: "Cloudflare Worker", type: "tech", icon: "/icons/simple-icons--cloudflareworker.svg" },
  { name: "Google ML Kit", type: "tech", icon: "/icons/logos--googlemlkit.png" },
  { name: "FL Studio", type: "tech", icon: "i-ri-sound-module-fill" },

  { name: "English", type: "language" },
  { name: "Indonesia", type: "language" },
  { name: "Japan", type: "language" },
] as const satisfies readonly TechItem[];

export type TechName = (typeof techItems)[number]["name"];

export const TECH_NAMES = techItems.map((t) => t.name) as [
  TechName,
  ...TechName[],
];

export function findTechItem(name: string): (typeof techItems)[number] | undefined {
  const lower = name.toLowerCase();
  return techItems.find((t) => t.name.toLowerCase() === lower);
}

export function resolveTechItem(name: string): TechItem {
  return (
    findTechItem(name) ?? {
      name,
      type: "tech",
      icon: "",
    }
  );
}
