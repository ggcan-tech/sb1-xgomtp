export interface Place {
  id: string;
  name: string;
  stylePreference: string;
}

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  type: string;
  category: string;
}

export class UserProfile {
  places: Place[] = [];
  wardrobe: WardrobeItem[] = [];
}