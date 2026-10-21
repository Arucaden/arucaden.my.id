export type TechType = 'tech' | 'language';

export type TechTool = {
  name: string;
  type: 'tech';
  icon: string;
};

export type TechLanguage = {
  name: string;
  type: 'language';
  icon?: string;
};

export type TechItem = TechTool | TechLanguage;

export type Tech = TechItem;
