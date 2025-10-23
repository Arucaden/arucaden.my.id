import type { Blog } from '@/types/blog.ts';

export const blogs: Blog[] = [
  {
    title: 'Designing a Clean Game Architecture',
    slug: 'clean-game-architecture',
    excerpt: 'Thoughts on structuring systems and gameplay code with SOLID and event-driven patterns to keep things scalable and fun to work on.',
    date: '2025-03-01',
    readTime: '6 min read',
    tags: ['Game Dev', 'Architecture', 'Unity'],
    href: '#',
  },
  {
    title: 'From Figma to Flutter: Closing the Gap',
    slug: 'figma-to-flutter',
    excerpt: 'Notes on translating visual design into performant, reusable Flutter widgets with MVVM and proper state management.',
    date: '2025-02-10',
    readTime: '5 min read',
    tags: ['Flutter', 'UI/UX', 'MVVM'],
    href: '#',
  },
  {
    title: 'Reusable Object Pooling Patterns',
    slug: 'object-pooling-patterns',
    excerpt: 'Generic object pools that play nicely with different object types, with a focus on clarity and performance.',
    date: '2025-01-22',
    readTime: '4 min read',
    tags: ['Performance', 'Patterns'],
    href: '#',
  },
];
