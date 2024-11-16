import { useState } from 'react';
import { ClothingAttributes } from '../types/clothing';
import { analyzeProductUrl } from '../services/productAnalysis';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, category: string, attributes?: Partial<ClothingAttributes>) => void;
}

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [addMethod, setAddMethod] = useState<'url' | 'photo' | null>(null);
  const [productUrl, setProductUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleClose = () => {
    setProductUrl('');
    setImageUrl('');
    setSelectedCategory('');
    setAddMethod(null);
    setError('');
    onClose();
  };

  const handleUrlAnalysis = async () => {
    if (!productUrl) {
      setError('Please enter a product URL');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const { imageUrl, attributes } = await analyzeProductUrl(productUrl);
      setImageUrl(imageUrl);
      setSelectedCategory(attributes.category);
      onAdd(imageUrl, attributes.category, attributes);
      handleClose();
    } catch (error: any) {
      console.error('Error analyzing URL:', error);
      setError(
        error.message === 'Failed to fetch' 
          ? 'Unable to connect to the server. Please try again.'
          : error.message || 'Failed to analyze product. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onAdd(imageUrl, 'Tops');
        handleClose();
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      setError(error.message || 'Failed to upload photo');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Item</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {!addMethod ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAddMethod('url')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-colors text-center"
            >
              <span className="block text-3xl mb-2">🔗</span>
              <span className="font-medium">Shopping Link</span>
            </button>
            <button
              onClick={() => setAddMethod('photo')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-colors text-center"
            >
              <span className="block text-3xl mb-2">📸</span>
              <span className="font-medium">Take Photo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addMethod === 'url' ? (
              <>
                <div>
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => {
                      setProductUrl(e.target.value);
                      setError('');
                    }}
                    placeholder="Paste shopping link here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                </div>
                <button
                  onClick={handleUrlAnalysis}
                  disabled={isAnalyzing || !productUrl}
                  className="w-full py-3 px-4 bg-black text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Add Item'}
                </button>
              </>
            ) : (
              <label className="block w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handlePhotoUpload(file);
                    }
                  }}
                />
                <div className="h-full flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2">📸</span>
                  <span className="text-sm text-gray-500">Tap to take a photo</span>
                </div>
              </label>
            )}

            <button
              onClick={() => setAddMethod(null)}
              className="w-full py-2 text-gray-600 hover:text-black"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}