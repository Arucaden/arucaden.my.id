export type Tech = {
  name: string;
  type: 'tech' | 'language';
  icon?: string;
};

export const techItems: Tech[] = [
  { name: "JavaScript", type: "tech", icon: "i-logos-javascript" },
  { name: "Python", type: "tech", icon: "i-grommet-icons-python" },
  { name: "Unity", type: "tech", icon: "i-grommet-icons:gamepad" },
  { name: "C#", type: "tech", icon: "i-grommet-icons:code" },
  { name: "Photoshop", type: "tech", icon: "i-grommet-icons-brush" },
  { name: "Astro", type: "tech", icon: "i-grommet-icons-astro" },
  { name: "Tailwind", type: "tech", icon: "i-grommet-icons-css3" },
  { name: "Svelte", type: "tech", icon: "i-grommet-icons-svelte" },
  { name: "Blender", type: "tech", icon: "i-grommet-icons-blender" },
  { name: "Figma", type: "tech", icon: "i-grommet-icons:figma" },
  { name: "MySQL", type: "tech", icon: "i-grommet-icons-database" },
  { name: "Flutter", type: "tech", icon: "i-grommet-icons-flutter" },
  { name: "Java", type: "tech", icon: "i-grommet-icons-java" },
  { name: "Clip Studio", type: "tech", icon: "i-grommet-icons-clipstudio" },
  { name: "Indonesia", type: "language" },
  { name: "English", type: "language" },
  { name: "Japan", type: "language" }
];