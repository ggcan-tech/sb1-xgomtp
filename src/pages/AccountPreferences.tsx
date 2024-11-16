import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';

interface StylePreference {
  placeId: string;
  placeName: string;
  styles: Array<{
    name: string;
    description?: string;
  }>;
}

export default function AccountPreferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<StylePreference[]>([]);

  useEffect(() => {
    const savedPreferences = localStorage.getItem('stylePreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => navigate('/account')}
            className="mr-4 text-gray-600 hover:text-black"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-black">Style Preferences</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {preferences.length > 0 ? (
            preferences.map((pref) => (
              <div key={pref.placeId} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{pref.placeName}</h3>
                    <div className="mt-2 space-y-1">
                      {pref.styles.map((style, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-gray-600">{style.name}</span>
                          {style.description && (
                            <p className="text-gray-500 text-xs mt-1">{style.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/style-preferences', {
                      state: {
                        fromAccount: true,
                        editingPlace: true,
                        selectedPlaces: [{
                          id: pref.placeId,
                          name: pref.placeName,
                          icon: '📍',
                          description: ''
                        }]
                      }
                    })}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <p className="text-gray-500 mb-4">No style preferences set yet.</p>
              <button
                onClick={() => navigate('/places-selection', { state: { fromAccount: true } })}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
              >
                Add Your First Place
              </button>
            </div>
          )}

          {preferences.length > 0 && (
            <button
              onClick={() => navigate('/places-selection', { state: { fromAccount: true } })}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              Add New Place
            </button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}