import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';

export default function AccountSettings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

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
          <h1 className="text-2xl font-bold text-black">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <button
              onClick={() => alert('Change Password')}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              Change Password
            </button>
            
            <button
              onClick={() => alert('Notification Settings')}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              Notification Settings
            </button>
            
            <button
              onClick={() => alert('Privacy Settings')}
              className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50"
            >
              Privacy Settings
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-left py-3 px-4 text-red-500 rounded-lg hover:bg-red-50"
            >
              Log Out
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}