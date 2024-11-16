import fetch from 'node-fetch';
import cheerio from 'cheerio';

async function extractProductInfo(url, html) {
  const $ = cheerio.load(html);
  
  // Basic product info
  const title = $('h1').first().text().trim() || 
                $('[class*="title"]').first().text().trim() ||
                $('[class*="product-name"]').first().text().trim();
                
  const description = $('[class*="description"]').text().trim() ||
                     $('meta[name="description"]').attr('content');

  // Images
  const imageUrl = $('meta[property="og:image"]').attr('content') || 
                  $('meta[name="twitter:image"]').attr('content') ||
                  $('.product-image img').attr('src') ||
                  $('img[id*="product"][src*="http"]').first().attr('src');

  // Extract detailed attributes
  const pageText = $('body').text().toLowerCase();
  
  // Category detection
  let category = 'Unknown';
  if (pageText.includes('shirt') || pageText.includes('top') || pageText.includes('blouse')) {
    category = 'Tops';
  } else if (pageText.includes('pant') || pageText.includes('jean') || pageText.includes('trouser')) {
    category = 'Bottoms';
  } else if (pageText.includes('dress')) {
    category = 'Dresses';
  } else if (pageText.includes('jacket') || pageText.includes('coat')) {
    category = 'Outerwear';
  }

  // Style analysis
  const styleKeywords = {
    casual: ['casual', 'everyday', 'relaxed', 'comfortable'],
    formal: ['formal', 'elegant', 'sophisticated', 'dressy'],
    business: ['professional', 'office', 'workwear', 'business'],
    sporty: ['athletic', 'sport', 'active', 'workout'],
    trendy: ['fashion', 'trendy', 'stylish', 'modern']
  };

  let style = Object.entries(styleKeywords).find(([key, words]) => 
    words.some(word => pageText.includes(word))
  )?.[0] || 'casual';

  // Color extraction
  const colorKeywords = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 
                        'navy', 'grey', 'brown', 'beige', 'cream', 'orange'];
  const color = colorKeywords.find(color => pageText.includes(color)) || 'Unknown';

  // Material analysis
  const materials = {
    cotton: ['cotton', '100% cotton', 'organic cotton'],
    wool: ['wool', 'merino', 'cashmere'],
    synthetic: ['polyester', 'nylon', 'spandex', 'elastane'],
    silk: ['silk'],
    linen: ['linen'],
    leather: ['leather', 'suede']
  };

  let material = Object.entries(materials).find(([key, words]) =>
    words.some(word => pageText.includes(word))
  )?.[0] || 'Unknown';

  // Season detection
  let season = 'All Season';
  if (pageText.includes('summer')) season = 'Summer';
  else if (pageText.includes('winter')) season = 'Winter';
  else if (pageText.includes('spring')) season = 'Spring';
  else if (pageText.includes('fall') || pageText.includes('autumn')) season = 'Fall';

  // Formality level
  let formality = 'casual';
  if (pageText.includes('formal') || pageText.includes('evening')) formality = 'formal';
  else if (pageText.includes('business') || pageText.includes('office')) formality = 'business';

  // Fit analysis
  let fit = 'regular';
  if (pageText.includes('slim') || pageText.includes('fitted')) fit = 'slim';
  else if (pageText.includes('loose') || pageText.includes('oversized')) fit = 'loose';

  // Pattern detection
  const patterns = ['striped', 'plaid', 'floral', 'checked', 'solid', 'printed', 'polka dot'];
  const pattern = patterns.find(p => pageText.includes(p)) || 'solid';

  // Brand extraction
  const brand = $('[class*="brand"]').first().text().trim() ||
                $('meta[property="og:brand"]').attr('content') ||
                new URL(url).hostname.split('.')[1];

  // Detailed features
  const features = [];
  ['pockets', 'zipper', 'buttons', 'hood', 'collar', 'belt'].forEach(feature => {
    if (pageText.includes(feature)) features.push(feature);
  });

  // Care instructions
  const care = [];
  ['machine wash', 'hand wash', 'dry clean', 'iron', 'tumble dry'].forEach(instruction => {
    if (pageText.includes(instruction)) care.push(instruction);
  });

  // Sustainability features
  const sustainability = [];
  ['organic', 'recycled', 'sustainable', 'eco-friendly'].forEach(feature => {
    if (pageText.includes(feature)) sustainability.push(feature);
  });

  // Measurements and sizing
  const measurements = {};
  ['length', 'chest', 'waist', 'hip'].forEach(measure => {
    const measureRegex = new RegExp(`${measure}[:\\s]+([\\d.]+)\\s*(cm|in)`);
    const match = pageText.match(measureRegex);
    if (match) measurements[measure] = `${match[1]}${match[2]}`;
  });

  return {
    success: true,
    imageUrl,
    category,
    style,
    color,
    material,
    season,
    formality,
    fit,
    pattern,
    brand,
    fabric: material,
    care,
    features,
    occasion: [formality === 'formal' ? 'formal events' : 
               formality === 'business' ? 'work' : 'casual wear'],
    neckline: pageText.includes('v-neck') ? 'v-neck' :
              pageText.includes('crew') ? 'crew neck' :
              pageText.includes('turtleneck') ? 'turtleneck' : undefined,
    sleeve: pageText.includes('long sleeve') ? 'long' :
            pageText.includes('short sleeve') ? 'short' :
            pageText.includes('sleeveless') ? 'sleeveless' : undefined,
    length: pageText.includes('mini') ? 'mini' :
            pageText.includes('midi') ? 'midi' :
            pageText.includes('maxi') ? 'maxi' : undefined,
    closure: pageText.includes('zipper') ? 'zipper' :
             pageText.includes('buttons') ? 'buttons' :
             pageText.includes('pullover') ? 'pullover' : undefined,
    sustainability,
    measurements
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const productInfo = await extractProductInfo(url, html);

    return res.status(200).json(productInfo);
  } catch (error) {
    console.error('Error analyzing product:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze product'
    });
  }
}