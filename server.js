import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1'
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/api/analyze-product', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL is required' 
      });
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000,
      maxRedirects: 5
    });

    const html = response.data;
    const $ = cheerio.load(html);

    let imageUrl = $('meta[property="og:image"]').attr('content') || 
                  $('meta[name="twitter:image"]').attr('content') ||
                  $('.product-image img').attr('src') ||
                  $('img[id*="product"][src*="http"]').first().attr('src') ||
                  $('img[src*="product"][src*="http"]').first().attr('src');

    if (imageUrl && !imageUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      imageUrl = new URL(imageUrl, baseUrl.origin).toString();
    }

    if (!imageUrl) {
      throw new Error('No product image found');
    }

    const description = $('meta[name="description"]').attr('content') ||
                       $('[class*="description"]').text().trim();
    
    const title = $('meta[property="og:title"]').attr('content') ||
                 $('h1').first().text().trim();

    // Use GPT-4 Mini for analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview", // Using GPT-4 Mini model
      temperature: 0.7, // Slightly more creative
      max_tokens: 500, // Shorter responses
      messages: [
        {
          role: "system",
          content: "You are a fashion expert AI that analyzes clothing items and provides detailed attributes. Be concise but accurate."
        },
        {
          role: "user",
          content: `Analyze this clothing item and provide key attributes:
          Title: ${title}
          Description: ${description}
          URL: ${url}`
        }
      ],
      response_format: { type: "json_object" } // Ensure JSON response
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    return res.json({
      success: true,
      imageUrl,
      ...analysis
    });

  } catch (error) {
    console.error('Error analyzing product:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Error analyzing URL',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});