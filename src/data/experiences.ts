import type { Experience } from '@/types/experience.ts';

export const experiences: Experience[] = [
  {
    company: '3PM-Game studio',
    period: '1 July 2025 - 31 December 2025',
    type: 'Internship',
    location: 'Hybrid',
    role: 'Game Developer Intern',
    points: 
    [
      'Designed modular and scalable game systems to ensure maintainability and easy updates.',
      'Developed game components using SOLID, OOP, and Event driven principles in Unity.',
      'Integrated core game mechanics and features for robust and bug-free game systems',
      'Created 2D animated water and foliage shaders using Unity Shader Graph for environmental effects.',
      'Created Generic Object Pooling system to optimize performance and reduce memory usage also reusable for any type of object',
      'Implemented enemy State Machine architecture (enter, exit, cancel states) for consistent state transitions.',
      'Collaborated with designers and artist team to implement game assets.'
    ],
  },

  {
    company: 'PT. Teknologi Solusi Aquatic',
    period: '1 February 2025 - 31 June 2025',
    type: 'Internship',
    location: 'On-site',
    role: 'Flutter Developer Intern',
    points: 
    [
      'Developed API integration to connect Flutter frontend with backend services, ensuring reliable data flow.',
      'Applied the MVVM architecture, improving project scalability, maintainability, and team collaboration efficiency.',
      'Implemented secure local storage to enhance login reliability, enabling offline access and seamless authentication without frequent server checks.',
      'Built and maintained core data layer components, including Models, Services, and Repository, to ensure clean separation of concerns.',
      'Translated UI/UX designs from Figma to responsive Flutter code, ensuring a consistent user experience across devices.',
      'Developed reusable widgets and components to maintain design consistency and performance across the application.',
      'Used Provider state management to efficiently manage application state and improve performance.'
    ],
  },
];
