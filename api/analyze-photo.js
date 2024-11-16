import { createCanvas, loadImage } from 'canvas';
import ColorThief from 'colorthief';

async function analyzeImage(imageData) {
  try {
    // Create a temporary URL from the base64 image
    const base64Image = imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;
    
    // Load image and create canvas
    const image = await loadImage(base64Image);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    // Extract dominant colors using ColorThief
    const colorThief = new ColorThief();
    const imageElement = await loadImage(base64Image);
    const dominantColor = colorThief.getColor(imageElement);
    
    // Convert RGB to hex
    const dominantColorHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);

    // Analyze image proportions for basic category detection
    const aspectRatio = image.width / image.height;
    let category = 'Tops';

    if (aspectRatio > 1.5) {
      category = 'Accessories';
    } else if (aspectRatio < 0.5) {
      category = 'Dresses';
    } else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
      category = 'Tops';
    } else {
      category = 'Bottoms';
    }
    
    return {
      success: true,
      imageUrl: base64Image,
      productInfo: {
        category,
        style: 'Casual',
        color: dominantColorHex,
        material: 'Cotton',
        season: 'All Season',
        formality: 'casual',
        fit: 'regular',
        pattern: 'solid',
        details: {
          features: [],
          care: ['Machine wash'],
          occasion: ['Casual wear'],
          measurements: {}
        }
      }
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image: ' + error.message);
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image data is required' 
      });
    }

    const analysis = await analyzeImage(image);
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze image'
    });
  }
}