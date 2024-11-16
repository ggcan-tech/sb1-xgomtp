import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';

export default function Account() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with 3D depth */}
      <div className="bg-white shadow-lg relative z-10">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-500">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {userName}
                </h1>
                <p className="text-gray-500">Level 10</p>
              </div>
            </div>

            {/* Compact Progress Circle */}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset="70"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900">85%</span>
                <span className="text-xs text-gray-500">Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/account/profile')}
          className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transform transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500">View and edit your profile</p>
              </div>
            </div>
            <span className="text-blue-500">→</span>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/account/preferences')}
          className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Style Preferences</h2>
                <p className="text-sm text-gray-500">Manage your style settings</p>
              </div>
            </div>
            <span className="text-purple-500">→</span>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/account/activities')}
          className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                <p className="text-sm text-gray-500">Your latest actions and updates</p>
              </div>
            </div>
            <span className="text-green-500">→</span>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/account/settings')}
          className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-500">App preferences and account settings</p>
              </div>
            </div>
            <span className="text-gray-500">→</span>
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}