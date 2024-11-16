import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: string;
}

export default function WardrobeSetup() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: WardrobeItem = {
          id: Date.now().toString(),
          imageUrl: reader.result as string,
          category: 'Tops'
        };
        setItems([...items, newItem]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-2">Let's Build Your Wardrobe</h1>
        <p className="text-gray-600 mb-8">Take photos of your clothes to get personalized outfit recommendations</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <label className="flex flex-col items-center justify-center h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-2xl mb-2">📸</span>
              <span className="text-sm text-gray-500">Take Photo</span>
            </div>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
          </label>

          <label className="flex flex-col items-center justify-center h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-2xl mb-2">🖼️</span>
              <span className="text-sm text-gray-500">Upload from Gallery</span>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        {items.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Your Wardrobe Items</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden shadow-sm">
                  <img src={item.imageUrl} alt="Wardrobe item" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="space-y-4">
          {items.length > 0 && (
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Continue to App
            </button>
          )}
          
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Do This Later
          </button>
        </div>
      </div>
    </div>
  );
}