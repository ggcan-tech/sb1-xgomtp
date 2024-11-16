import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';

interface Activity {
  id: string;
  type: 'outfit_generated' | 'item_added' | 'style_updated';
  description: string;
  timestamp: number;
}

export default function AccountActivities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities([
      {
        id: '1',
        type: 'outfit_generated',
        description: 'Generated a casual outfit for coffee shop',
        timestamp: Date.now() - 3600000
      },
      {
        id: '2',
        type: 'item_added',
        description: 'Added new jacket to wardrobe',
        timestamp: Date.now() - 86400000
      },
      {
        id: '3',
        type: 'style_updated',
        description: 'Updated work style preferences',
        timestamp: Date.now() - 172800000
      }
    ]);
  }, []);

  const formatTimestamp = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
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
          <h1 className="text-2xl font-bold text-black">Recent Activities</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <span className="text-2xl">
                  {activity.type === 'outfit_generated' ? '✨' :
                   activity.type === 'item_added' ? '👕' : '🎯'}
                </span>
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}