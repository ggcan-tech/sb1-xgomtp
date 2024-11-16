import { ClothingAttributes } from '../types/clothing';

interface ProductInfo {
  title: string;
  description: string;
  price?: string;
  images: string[];
  metadata: {
    [key: string]: string;
  };
}

export async function analyzeProductUrl(url: string): Promise<{
  imageUrl: string;
  attributes: ClothingAttributes;
}> {
  try {
    const response = await fetch('/api/analyze-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze product');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to analyze product');
    }

    return {
      imageUrl: data.imageUrl,
      attributes: {
        category: data.category,
        style: data.style,
        color: data.color,
        material: data.material,
        season: data.season,
        formality: data.formality,
        fit: data.fit,
        pattern: data.pattern,
        brand: data.brand,
        details: {
          fabric: data.fabric,
          care: data.care,
          features: data.features,
          occasion: data.occasion,
          neckline: data.neckline,
          sleeve: data.sleeve,
          length: data.length,
          closure: data.closure,
          sustainability: data.sustainability,
          measurements: data.measurements
        }
      }
    };
  } catch (error) {
    console.error('Error analyzing product:', error);
    throw error;
  }
}