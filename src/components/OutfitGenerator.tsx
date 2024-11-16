import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClothingAttributes {
  category: string;
  style: string;
  color: string;
  material: string;
  season: string;
  formality: 'casual' | 'business' | 'formal';
  fit: 'loose' | 'regular' | 'slim';
  pattern?: string;
  brand?: string;
}

interface WardrobeItem {
  id: string;
  imageUrl: string;
  attributes: ClothingAttributes;
}

interface GeneratedOutfit {
  items: WardrobeItem[];
  description: string;
  styleNotes: string[];
  colorPalette: string[];
  occasions: string[];
  weatherSuitability: string[];
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'boolean' | 'multiselect';
  options?: string[];
  placeholder?: string;
}

interface OutfitGeneratorProps {
  onClose: () => void;
}

const QUESTIONS: Question[] = [
  {
    id: 'occasion',
    text: 'What\'s the occasion?',
    type: 'text',
    placeholder: 'e.g., Work meeting, Date night, Casual outing'
  },
  {
    id: 'style',
    text: 'Preferred style for this occasion?',
    type: 'multiselect',
    options: ['Professional', 'Casual', 'Elegant', 'Trendy', 'Sporty']
  },
  {
    id: 'colors',
    text: 'Any color preferences?',
    type: 'multiselect',
    options: ['Neutral', 'Bright', 'Dark', 'Pastel', 'Monochrome']
  },
  {
    id: 'weather',
    text: 'Current weather conditions?',
    type: 'multiselect',
    options: ['Sunny', 'Rainy', 'Cold', 'Hot', 'Mild']
  }
];

export default function OutfitGenerator({ onClose }: OutfitGeneratorProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<GeneratedOutfit | null>(null);

  const handleAnswer = (answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [QUESTIONS[currentQuestionIndex].id]: answer
    }));

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generateOutfit();
    }
  };

  const matchClothingAttributes = (
    wardrobe: WardrobeItem[],
    preferences: Record<string, string | string[]>
  ): WardrobeItem[] => {
    // Score each item based on how well it matches the preferences
    const scoredItems = wardrobe.map(item => {
      let score = 0;
      const attrs = item.attributes;

      // Match formality with occasion
      if (preferences.occasion) {
        const occasion = preferences.occasion.toString().toLowerCase();
        if (
          (occasion.includes('work') && attrs.formality === 'business') ||
          (occasion.includes('party') && attrs.formality === 'formal') ||
          (occasion.includes('casual') && attrs.formality === 'casual')
        ) {
          score += 2;
        }
      }

      // Match style preferences
      if (Array.isArray(preferences.style)) {
        if (preferences.style.some(style => 
          attrs.style.toLowerCase().includes(style.toLowerCase())
        )) {
          score += 2;
        }
      }

      // Match weather conditions
      if (Array.isArray(preferences.weather)) {
        const weather = preferences.weather[0].toLowerCase();
        if (
          (weather === 'hot' && attrs.material.includes('cotton')) ||
          (weather === 'cold' && attrs.material.includes('wool')) ||
          (weather === 'rainy' && attrs.material.includes('waterproof'))
        ) {
          score += 1;
        }
      }

      return { item, score };
    });

    // Sort by score and return top items
    return scoredItems
      .sort((a, b) => b.score - a.score)
      .map(scored => scored.item)
      .slice(0, 3);
  };

  const generateOutfit = async () => {
    setIsGenerating(true);

    try {
      // Get wardrobe items with detailed attributes
      const wardrobeItems: WardrobeItem[] = JSON.parse(
        localStorage.getItem('wardrobeItems') || '[]'
      );

      // Match items based on preferences
      const matchedItems = matchClothingAttributes(wardrobeItems, answers);

      // Generate color palette based on selected items
      const colorPalette = [...new Set(matchedItems.map(item => item.attributes.color))];

      // Determine suitable occasions based on formality and style
      const occasions = matchedItems.reduce((acc: string[], item) => {
        switch (item.attributes.formality) {
          case 'business':
            acc.push('Work', 'Business meetings');
            break;
          case 'formal':
            acc.push('Special events', 'Formal gatherings');
            break;
          case 'casual':
            acc.push('Daily wear', 'Casual outings');
            break;
        }
        return [...new Set(acc)];
      }, []);

      // Determine weather suitability
      const weatherSuitability = matchedItems.reduce((acc: string[], item) => {
        const { material, season } = item.attributes;
        if (material.includes('wool')) acc.push('Cold weather');
        if (material.includes('cotton')) acc.push('Warm weather');
        if (material.includes('waterproof')) acc.push('Rainy weather');
        if (season) acc.push(`Perfect for ${season}`);
        return [...new Set(acc)];
      }, []);

      const outfit: GeneratedOutfit = {
        items: matchedItems,
        description: `Perfect outfit for ${answers.occasion}, matching your style preferences and weather conditions.`,
        styleNotes: [
          `Coordinated ${colorPalette.join(', ')} color palette`,
          `${matchedItems[0].attributes.formality.charAt(0).toUpperCase() + 
            matchedItems[0].attributes.formality.slice(1)} ensemble`,
          `Complementary fits and styles`
        ],
        colorPalette,
        occasions,
        weatherSuitability
      };

      setGeneratedOutfit(outfit);
    } catch (error) {
      console.error('Error generating outfit:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <AnimatePresence mode="wait">
        {!generatedOutfit ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Let's Find Your Perfect Outfit</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">✨</div>
                <p className="text-gray-600">Analyzing your wardrobe...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Matching items with your preferences
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{currentQuestion.text}</h3>
                  {currentQuestion.type === 'text' ? (
                    <input
                      type="text"
                      placeholder={currentQuestion.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                          handleAnswer((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  ) : currentQuestion.type === 'multiselect' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {currentQuestion.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer([option])}
                          className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAnswer('yes')}
                        className="py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer('no')}
                        className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Perfect Outfit</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600">{generatedOutfit.description}</p>

              <div className="grid grid-cols-3 gap-4">
                {generatedOutfit.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.attributes.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.attributes.category} · {item.attributes.style}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Style Notes:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {generatedOutfit.styleNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Perfect For:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {generatedOutfit.occasions.map((occasion, index) => (
                      <li key={index}>{occasion}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Weather Suitability:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {generatedOutfit.weatherSuitability.map((weather, index) => (
                      <li key={index}>{weather}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setGeneratedOutfit(null);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                  }}
                  className="flex-1 py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Generate Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}