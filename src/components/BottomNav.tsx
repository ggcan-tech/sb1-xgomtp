import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between py-3">
          <button
            onClick={() => navigate('/home')}
            className={`flex flex-col items-center ${isActive('/home') ? 'text-black' : 'text-gray-500'}`}
          >
            <span className="text-2xl">🏠</span>
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => navigate('/wardrobe')}
            className={`flex flex-col items-center ${isActive('/wardrobe') ? 'text-black' : 'text-gray-500'}`}
          >
            <span className="text-2xl">👕</span>
            <span className="text-xs mt-1">Wardrobe</span>
          </button>

          <button
            onClick={() => navigate('/social')}
            className={`flex flex-col items-center ${isActive('/social') ? 'text-black' : 'text-gray-500'}`}
          >
            <span className="text-2xl">👥</span>
            <span className="text-xs mt-1">Social</span>
          </button>

          <button
            onClick={() => navigate('/account')}
            className={`flex flex-col items-center ${isActive('/account') ? 'text-black' : 'text-gray-500'}`}
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-1">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}