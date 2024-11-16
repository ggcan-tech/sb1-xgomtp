import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Place {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface StylePreference {
  placeId: string;
  placeName: string;
  styles: Array<{
    name: string;
    description?: string;
  }>;
}

const STYLE_OPTIONS = [
  {
    name: 'Casual',
    description: 'Comfortable, everyday wear perfect for relaxed settings',
    examples: ['Jeans & T-shirt', 'Sweaters', 'Sneakers'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'
  },
  {
    name: 'Business Casual',
    description: 'Professional yet relaxed, perfect for modern workplaces',
    examples: ['Blazer & Chinos', 'Dress Shirt', 'Loafers'],
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400'
  },
  {
    name: 'Formal',
    description: 'Sophisticated and polished for important occasions',
    examples: ['Suits', 'Dress Shoes', 'Formal Accessories'],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400'
  },
  {
    name: 'Sporty',
    description: 'Athletic and functional for active lifestyles',
    examples: ['Athletic Wear', 'Running Shoes', 'Sports Accessories'],
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400'
  },
  {
    name: 'Streetwear',
    description: 'Urban, trendy, and fashion-forward',
    examples: ['Hoodies', 'Limited Sneakers', 'Statement Pieces'],
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400'
  },
  {
    name: 'Bohemian',
    description: 'Free-spirited and artistic with natural elements',
    examples: ['Flowy Dresses', 'Natural Fabrics', 'Layered Jewelry'],
    image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400'
  },
  {
    name: 'Minimalist',
    description: 'Clean lines and simple, timeless pieces',
    examples: ['Basic Essentials', 'Neutral Colors', 'Quality Basics'],
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'
  },
  {
    name: 'Vintage',
    description: 'Retro-inspired looks from past decades',
    examples: ['Retro Pieces', 'Classic Patterns', 'Period Accessories'],
    image: 'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=400'
  }
];

export default function StylePreferences() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [stylePreferences, setStylePreferences] = useState<StylePreference[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [showExampleImage, setShowExampleImage] = useState<string | null>(null);
  const [styleDescription, setStyleDescription] = useState('');

  useEffect(() => {
    const places = location.state?.selectedPlaces;
    if (places) {
      setSelectedPlaces(places);
    } else {
      navigate('/places-selection');
    }

    // Load existing preferences if editing
    if (location.state?.editingPlace) {
      const savedPreferences = localStorage.getItem('stylePreferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        const placePreference = preferences.find(
          (p: StylePreference) => p.placeId === places[0].id
        );
        if (placePreference) {
          setSelectedStyles(placePreference.styles.map((s: any) => s.name));
        }
      }
    }
  }, [location.state, navigate]);

  const handleStyleSelect = (styleName: string) => {
    setSelectedStyles(prev => {
      const isSelected = prev.includes(styleName);
      if (isSelected) {
        return prev.filter(s => s !== styleName);
      }
      if (prev.length < 2) {
        return [...prev, styleName];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selectedStyles.length > 0 && currentPlaceIndex < selectedPlaces.length) {
      const currentPlace = selectedPlaces[currentPlaceIndex];
      const newPreference: StylePreference = {
        placeId: currentPlace.id,
        placeName: currentPlace.name,
        styles: selectedStyles.map(name => ({
          name,
          description: styleDescription
        }))
      };

      const updatedPreferences = [...stylePreferences, newPreference];
      setStylePreferences(updatedPreferences);

      if (currentPlaceIndex < selectedPlaces.length - 1) {
        setCurrentPlaceIndex(prev => prev + 1);
        setSelectedStyles([]);
        setStyleDescription('');
      } else {
        // If editing from account page
        if (location.state?.fromAccount) {
          const existingPreferences = JSON.parse(localStorage.getItem('stylePreferences') || '[]');
          let finalPreferences;

          if (location.state?.editingPlace) {
            // Update existing preference
            finalPreferences = existingPreferences.map((p: StylePreference) =>
              p.placeId === currentPlace.id ? newPreference : p
            );
          } else {
            // Add new preferences
            finalPreferences = [...existingPreferences, ...updatedPreferences];
          }

          localStorage.setItem('stylePreferences', JSON.stringify(finalPreferences));
          navigate('/account', { state: { activeTab: 'preferences' } });
        } else {
          // Normal flow
          localStorage.setItem('stylePreferences', JSON.stringify(updatedPreferences));
          navigate('/wardrobe-setup');
        }
      }
    }
  };

  const currentPlace = selectedPlaces[currentPlaceIndex];

  if (!currentPlace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-2xl">{currentPlace.icon}</span>
          <h1 className="text-3xl font-bold text-black border-b-2 border-black pb-1">
            Your style for {currentPlace.name}
          </h1>
        </div>
        <p className="text-gray-600 mb-8">
          Select up to two styles that best match how you'd like to dress at {currentPlace.name.toLowerCase()}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {STYLE_OPTIONS.map((style) => (
            <div
              key={style.name}
              className={`relative p-4 rounded-xl text-left transition-colors ${
                selectedStyles.includes(style.name)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{style.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExampleImage(showExampleImage === style.name ? null : style.name);
                  }}
                  className="text-xl opacity-80 hover:opacity-100 relative z-10"
                >
                  👁️
                </button>
              </div>
              <p className="text-sm opacity-80">{style.description}</p>
              
              <button
                onClick={() => handleStyleSelect(style.name)}
                className="absolute inset-0 w-full h-full cursor-pointer z-0"
              />

              {showExampleImage === style.name && (
                <div 
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-6"
                  style={{ zIndex: 9999 }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setShowExampleImage(null);
                    }
                  }}
                >
                  <div 
                    className="bg-white p-4 rounded-xl max-w-sm w-full shadow-xl transform transition-all"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{style.name}</h4>
                      <button 
                        onClick={() => setShowExampleImage(null)}
                        className="text-gray-500 hover:text-black"
                      >
                        ✕
                      </button>
                    </div>
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-medium mb-2">Key Pieces:</h4>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                      {style.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedStyles.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add details about your style preferences (optional):
            </label>
            <textarea
              value={styleDescription}
              onChange={(e) => setStyleDescription(e.target.value)}
              placeholder="E.g., I prefer colorful clothes, no synthetic materials..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
              rows={3}
            />
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={selectedStyles.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
              selectedStyles.length > 0
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentPlaceIndex < selectedPlaces.length - 1 ? 'Next Place' : 'Continue'}
          </button>

          <div className="text-center text-sm text-gray-500">
            Step {currentPlaceIndex + 1} of {selectedPlaces.length}
          </div>
        </div>
      </div>
    </div>
  );
}