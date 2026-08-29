export interface Certificate {
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  icon?: string;
  highlight?: boolean;
}

export const certificates: Certificate[] = [
  {
    name: 'Unity Certified Associate: Programmer',
    issuer: 'Unity Technologies',
    date: '2025',
    url: 'https://drive.google.com/file/d/15sRZIJPUoKbrHDbzhk_kAQvc2xNkSRo-/view?usp=sharing',
    icon: '/icons/logos--unity.svg',
    highlight: true,
  },
    {
    name: 'Complete web developement course',
    issuer: 'Udemy',
    date: '2026',
    url: 'https://drive.google.com/file/d/11AhpaBSLOU4cDcu5SBt4b7iDbc9msmQF/view?usp=sharing',
    icon: '/icons/logos--udemy.svg',
    highlight: true,
  },
];
