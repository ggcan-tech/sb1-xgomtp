import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import OutfitGenerator from '../components/OutfitGenerator';

export default function Home() {
  const navigate = useNavigate();
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-black">AI Outfit Generator</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-6">
        {!showGenerator ? (
          <>
            {/* Generate Outfit Button */}
            <button
              onClick={() => setShowGenerator(true)}
              className="w-full py-6 px-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 transition-colors mb-8"
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-3xl">✨</span>
                <span className="text-xl font-semibold">Generate New Outfit</span>
                <span className="text-sm text-gray-300">Get AI-powered outfit recommendations</span>
              </div>
            </button>

            {/* Quick Access Sections */}
            <div className="space-y-6">
              {/* Wardrobe Preview */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Wardrobe</h2>
                  <button
                    onClick={() => navigate('/wardrobe')}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {/* Preview of last 4 wardrobe items */}
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>

              {/* Social Feed Preview */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Style Community</h2>
                  <button
                    onClick={() => navigate('/social')}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Explore →
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Latest Style Trends</p>
                      <p className="text-xs text-gray-500">See what's popular today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <OutfitGenerator onClose={() => setShowGenerator(false)} />
        )}
      </main>

      <BottomNav />
    </div>
  );
}