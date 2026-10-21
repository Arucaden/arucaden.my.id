export type TechType = 'tech' | 'language';

export type TechItem =
  | {
      name: string;
      type: 'tech';
      icon: string;
    }
  | {
      name: string;
      type: 'language';
      icon?: string;
    };

export type Tech = TechItem;
