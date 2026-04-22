import type { Blog } from '@/types/blog.ts';

export const blogs: Blog[] = [
  {
    title: 'Damned Veil Devlog #1: Normal Mapping & Event Systems',
    slug: 'damnedveil',
    excerpt: 'A technical dive into building a dark pixel art game featuring strategic carrom-style mechanics, unity events, and experimental 2D normal maps.',
    date: '2025-04-22',
    readTime: '5 min read',
    tags: ['Unity', 'Game Dev', 'Pixel Art'],
    href: '/blog/damnedveil',
  },
  {
    title: 'arucaden.my.id: Why I Made This Website? Is It Worth It?',
    slug: 'arucaden',
    excerpt: 'The story behind my portfolio website. Why choosing specific technologies and what I learned from it.',
    date: '2025-03-10',
    readTime: '8 min read',
    tags: ['Astro', 'Svelte', 'UI/UX'],
    href: '/blog/arucaden',
  },
  {
    title: 'Ano Galaxy Shooter: Learning Game Feel & Polish',
    slug: 'anogalaxyshooter',
    excerpt: 'A retrospective on building a space shooter from scratch and exactly why "game feel" makes all the difference.',
    date: '2024-12-24',
    readTime: '4 min read',
    tags: ['Unity', 'Game Design'],
    href: '/blog/anogalaxyshooter',
  },
];
