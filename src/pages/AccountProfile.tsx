import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';

export default function AccountProfile() {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-black">Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div>
              <h2 className="text-xl font-semibold">
                {localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User'}
              </h2>
              <p className="text-gray-500">Member since 2024</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1">{localStorage.getItem('userEmail') || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Member since</label>
              <p className="mt-1">2024</p>
            </div>
            <button
              onClick={() => alert('Edit profile')}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}