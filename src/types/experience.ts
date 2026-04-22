export type Experience = {
  company: string;
  period: string;
  type: 'Full-time' | 'Internship' | 'Freelance' | 'Campus Organization' | 'Part-time';
  location: 'Remote' | 'On-site' | 'Hybrid';
  role: string;
  points: string[];
};

