import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Place {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const DEFAULT_PLACES: Place[] = [
  { id: '1', name: 'Work', icon: '💼', description: 'Office, meetings, professional settings' },
  { id: '2', name: 'School', icon: '📚', description: 'Classes, campus, study sessions' },
  { id: '3', name: 'Gym', icon: '💪', description: 'Workouts, sports activities' },
  { id: '4', name: 'Party', icon: '🎉', description: 'Social events, celebrations' },
  { id: '5', name: 'Travel', icon: '✈️', description: 'Vacations, sightseeing' },
  { id: '6', name: 'Coffee Shop', icon: '☕', description: 'Casual meetings, work sessions' },
  { id: '7', name: 'Restaurant', icon: '🍽️', description: 'Dining out, food events' },
  { id: '8', name: 'Shopping Mall', icon: '🛍️', description: 'Shopping, casual outings' },
  { id: '9', name: 'Beach', icon: '🏖️', description: 'Beach activities, water sports' },
  { id: '10', name: 'Cinema', icon: '🎬', description: 'Movies, entertainment' },
  { id: '11', name: 'Park', icon: '🌳', description: 'Outdoor activities, picnics' },
  { id: '12', name: 'Library', icon: '📚', description: 'Study, quiet activities' }
];

export default function PlacesSelection() {
  const navigate = useNavigate();
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [customPlace, setCustomPlace] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [places, setPlaces] = useState<Place[]>(DEFAULT_PLACES);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p.id === place.id);
      if (isSelected) {
        return prev.filter(p => p.id !== place.id);
      }
      return [...prev, place];
    });
  };

  const handleCustomPlaceAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customPlace.trim()) {
      const newPlace: Place = {
        id: `custom-${Date.now()}`,
        name: customPlace.trim(),
        icon: '📍',
        description: 'Custom location'
      };
      
      // Add to both places and selected places
      setPlaces([...places, newPlace]);
      setSelectedPlaces([...selectedPlaces, newPlace]);
      
      // Reset input
      setCustomPlace('');
      setShowCustomInput(false);
    }
  };

  const handleContinue = () => {
    if (selectedPlaces.length > 0) {
      navigate('/style-preferences', { 
        state: { selectedPlaces }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-2">Where do you usually go?</h1>
        <p className="text-gray-600 mb-8">
          Select all the places you frequently visit to get personalized style recommendations
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {places.map((place) => (
            <button
              key={place.id}
              onClick={() => handlePlaceSelect(place)}
              className={`p-4 rounded-xl text-left transition-colors ${
                selectedPlaces.some(p => p.id === place.id)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{place.icon}</span>
                <div>
                  <div className="font-medium">{place.name}</div>
                  <div className="text-sm opacity-80">{place.description}</div>
                </div>
              </div>
            </button>
          ))}
          
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="p-4 rounded-xl text-left transition-colors bg-gray-100 text-black hover:bg-gray-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">➕</span>
                <div>
                  <div className="font-medium">Add Custom Place</div>
                  <div className="text-sm text-gray-500">Add your own location</div>
                </div>
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-gray-100">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📍</span>
                <input
                  type="text"
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  onKeyPress={handleCustomPlaceAdd}
                  placeholder="Type and press Enter"
                  autoFocus
                  className="flex-1 bg-white px-3 py-2 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedPlaces.length === 0}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
            selectedPlaces.length > 0
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue ({selectedPlaces.length} selected)
        </button>
      </div>
    </div>
  );
}