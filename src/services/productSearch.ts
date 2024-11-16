import fetch from 'node-fetch';

interface SearchResult {
  title: string;
  brand: string;
  description: string;
  price: string;
  url: string;
  imageUrl: string;
  category: string;
  style: string;
  color: string;
  material: string;
  season: string;
  formality: 'casual' | 'business' | 'formal';
  fit: 'loose' | 'regular' | 'slim';
  pattern: string;
  details: {
    fabric: string;
    care: string[];
    features: string[];
    occasion: string[];
    neckline?: string;
    sleeve?: string;
    length?: string;
    closure?: string;
    sustainability: string[];
    measurements: {
      [key: string]: string;
    };
  };
}

export async function searchSimilarProducts(imageData: Buffer): Promise<SearchResult[]> {
  try {
    // First, use Google Lens API to find similar products
    const searchResponse = await fetch('https://lens.google.com/v3/upload', {
      method: 'POST',
      body: imageData,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    if (!searchResponse.ok) {
      throw new Error('Failed to search for similar products');
    }

    const searchResults = await searchResponse.json();
    const productUrls = searchResults.visualMatches
      .slice(0, 5)
      .map((match: any) => match.url);

    // Analyze each product URL to get detailed information
    const productDetails = await Promise.all(
      productUrls.map(async (url: string) => {
        const response = await fetch('/api/analyze-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
        });

        if (!response.ok) {
          throw new Error(`Failed to analyze product: ${url}`);
        }

        return response.json();
      })
    );

    // Filter out failed analyses and sort by similarity score
    return productDetails
      .filter(result => result.success)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  } catch (error) {
    console.error('Error searching for similar products:', error);
    throw error;
  }
}