import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import AddItemModal from '../components/AddItemModal';

interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: string;
}

export default function Wardrobe() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('wardrobeItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const handleAddItem = (imageUrl: string, category: string) => {
    const newItem: WardrobeItem = {
      id: Date.now().toString(),
      imageUrl,
      category
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    localStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));
  };

  const handleDeleteConfirm = () => {
    const updatedItems = items.filter(item => !selectedItems.includes(item.id));
    setItems(updatedItems);
    localStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));
    setSelectedItems([]);
    setIsEditing(false);
    setShowDeleteConfirmation(false);
  };

  const toggleItemSelection = (itemId: string) => {
    if (isEditing) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    }
  };

  const getItemsByCategory = (category: string): WardrobeItem[] => {
    return items.filter(item => item.category.toLowerCase() === category.toLowerCase());
  };

  const categories = [
    { id: 'tops', name: 'Tops', emoji: '👕' },
    { id: 'bottoms', name: 'Bottoms', emoji: '👖' },
    { id: 'dresses', name: 'Dresses', emoji: '👗' },
    { id: 'outerwear', name: 'Outerwear', emoji: '🧥' },
    { id: 'shoes', name: 'Shoes', emoji: '👟' },
    { id: 'accessories', name: 'Accessories', emoji: '👜' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">My Wardrobe</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditing 
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {isEditing ? 'Done' : 'Edit Items'}
          </button>
        </div>

        {/* Category Filter */}
        <div className="max-w-2xl mx-auto px-4 py-2 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === null
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex items-center space-x-1 ${
                  activeCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed right-6 bottom-24 z-20 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-900 transition-colors"
      >
        <span className="text-2xl">+</span>
      </button>
      
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = getItemsByCategory(category.name);
            if (activeCategory && activeCategory !== category.id) {
              return null;
            }
            if (categoryItems.length === 0) {
              return null;
            }
            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.emoji}</span>
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <span className="text-sm text-gray-500">({categoryItems.length})</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group ${
                        isEditing ? 'hover:opacity-90' : ''
                      }`}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                      {isEditing && selectedItems.includes(item.id) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-2xl">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      {/* Delete Confirmation */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Delete {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Button */}
      {isEditing && selectedItems.length > 0 && (
        <div className="fixed bottom-20 left-6 right-6 flex justify-center">
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Delete Selected ({selectedItems.length})
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}