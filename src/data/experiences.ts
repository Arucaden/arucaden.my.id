import type { Experience } from '@/types/experience.ts';

export const experiences: Experience[] = [
      {
      company: 'PT. Mega Marine Pride',
      period: 'September 2026',
      type: 'Internship',
      location: 'On-site',
      role: 'Junior Programmer Staff',
      points: 
      [
        'Developed and deployed end-to-end ERP modules using Laravel and Vue.js, streamlining inter-departmental operational workflows and internal business processes.',
        'Containerized the development and production workflows using Docker to ensure environment parity and seamless deployment.',
        'Developed and executed automated test scripts using Selenium to perform testing, ensuring bug free and secure feature before deployed into production.',
        'Architected relational multi database schemas, optimizing tables, relationships, and queries to support scalable data storage and integrity across new features.',
        'Conducted rigorous manual and unit testing prior to production deployment, mitigating regressions and ensuring stable software releases.',
        'Making technical documentation, including system flowcharts, and user manuals accelerating cross-departmental user onboarding and adoption.'

      ],
    },
    {
    company: 'Ariverse Studio',
    period: 'June 2026 - December 2026',
    type: 'Internship',
    location: 'Hybrid',
    role: 'Game Programmer',
    points: 
    [
      'Collaborate with Artists and Game Designer to Implements mechanics, systems, and gameplay features in Unity.',
      'Implement Unity Unit Testing to ensure bug free logic before integrated into another unit.',
      'Implement Proper Project Architecture and Assembly Definition to decrease domain reload time.',
      'Developing and mantain documentation for game systems and gameplay features.',
      'Integrate and extending third-party modules into game.'
    ],
  },
  {
    company: 'Nanami.id',
    period: 'October 2025 - October 2026',
    type: 'Part-time',
    location: 'Remote',
    role: 'Lead of Game and Design Nanami-WAVE',
    points: 
    [
      'Establish and document design and game development workflows, standards, and guidelines to ensure efficient, scalable, and consistent production processes.',
      'Oversee the development of Visual Novel content, including story structure, branching narrative, visual direction, music mood, and controlled use of Generative AI.',
      'Maintain effective communication and healthy collaboration within the team.',
      'Manage design scope and priorities to align creative ambition with project timelines and available resources.'
    ],
  },
  {
    company: '3PM-Solutions',
    period: '1 July 2025 - 31 December 2025',
    type: 'Internship',
    location: 'On-site',
    role: 'Game Programmer Intern',
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
    location: 'Hybrid',
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
    {
    company: 'Workshop Riset Informatika',
    period: 'January 2024 - December 2024',
    type: 'Campus Organization',
    location: 'On-site',
    role: 'Vice Head of Game Development Miniclass',
    points: 
    [
      'Support the Head of the Miniclass in planning and managing all activities.',
      'Act as a liaison between the mentoring team and participants to ensure smooth communication.',
      'Design and structure the syllabus, focusing on foundational game development concepts.',
      'Ensure the curriculum aligns with industry trends and participant needs.',
      'Provide hands-on mentoring to participants, offering guidance on technical and creative aspects of game development.',
      'Gather feedback from participants and mentors to improve the miniclass experience.'
    ],
  },
];
