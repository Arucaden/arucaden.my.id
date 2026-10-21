export type ArtworkTag =
  | '#2d'
  | '#3d'
  | '#pixel'
  | '#oc'
  | '#fanart'
  | '#scenery'
  | '#drawnfromlife'
  | '#design'
  | string;

export type Artwork = {
  title: string;
  year: number;
  image: string;
  description: string;
  tags: string[];
  featured?: boolean;
};
