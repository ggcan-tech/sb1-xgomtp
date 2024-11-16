export interface ClothingDetails {
  fabric: string;
  care: string[];
  features: string[];
  occasion: string[];
  neckline?: string;
  sleeve?: string;
  length?: string;
  closure?: string;
  sustainability?: string[];
  measurements?: {
    [key: string]: string;
  };
}

export interface ClothingAttributes {
  category: string;
  style: string;
  color: string;
  material: string;
  season: string;
  formality: 'casual' | 'business' | 'formal';
  fit: 'loose' | 'regular' | 'slim';
  pattern?: string;
  brand?: string;
  details: ClothingDetails;
}