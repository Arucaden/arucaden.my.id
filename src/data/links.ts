export interface SocialLink {
  name: string;
  href: string;
  iconClass: string;
  description: string;
  isInternal?: boolean;
}

export const links: SocialLink[] = [
  {
    name: 'Email',
    href: 'mailto:daffamaulanasatria@gmail.com',
    iconClass: 'i-ri-mail-fill',
    description: 'Contact me',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/daffa-ms',
    iconClass: 'i-ri-linkedin-fill',
    description: 'LinkedIn profile',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Arucaden',
    iconClass: 'i-ri-github-fill',
    description: 'Works and contributions',
  },
  {
    name: 'itch.io',
    href: 'https://itch.io/profile/arucaden',
    iconClass: 'i-ri-gamepad-fill',
    description: 'Check out my games',
  },
  {
    name: 'Resume',
    href: 'https://drive.google.com/file/d/1hoDgLe8ihe8UtMwUHxrwFh3fDYPD43qw/view?usp=sharing',
    iconClass: 'i-ri-file-text-fill',
    description: 'Read my resume here',
  },
  {
    name: 'MyAnimeList',
    href: '/mal',
    iconClass: 'i-ri-movie-2-fill',
    description: 'Anime collection & ratings',
    isInternal: true,
  },
];