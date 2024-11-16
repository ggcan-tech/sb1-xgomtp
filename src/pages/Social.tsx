import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import Post from '../components/Post';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  description: string;
  timestamp: number;
  likes: number;
  rating: number;
  ratingCount: number;
  comments: Comment[];
  styleTags: Array<{
    name: string;
    type: 'style' | 'feeling';
  }>;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    description: 'AI generated this perfect casual weekend outfit! 🌟',
    timestamp: Date.now() - 3600000,
    likes: 24,
    rating: 4.5,
    ratingCount: 12,
    comments: [
      {
        id: 'c1',
        userId: 'user2',
        userName: 'Mike Chen',
        text: 'Love the color combination!',
        timestamp: Date.now() - 1800000
      }
    ],
    styleTags: [
      { name: 'Casual', type: 'style' },
      { name: 'Comfortable', type: 'feeling' }
    ]
  },
  {
    id: '2',
    userId: 'user3',
    userName: 'Emma Wilson',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800',
    description: 'Business meeting ready with this AI-curated outfit 💼',
    timestamp: Date.now() - 7200000,
    likes: 18,
    rating: 4.8,
    ratingCount: 8,
    comments: [],
    styleTags: [
      { name: 'Business', type: 'style' },
      { name: 'Professional', type: 'feeling' }
    ]
  }
];

export default function Social() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<'trending' | 'following'>('trending');
  const [favoriteStyles, setFavoriteStyles] = useState<string[]>([]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  const handleRate = (postId: string, rating: number) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newRatingCount = post.ratingCount + 1;
        const newRating = ((post.rating * post.ratingCount) + rating) / newRatingCount;
        return { ...post, rating: newRating, ratingCount: newRatingCount };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: localStorage.getItem('userName') || 'You',
      text,
      timestamp: Date.now()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const handleToggleFavoriteStyle = (styleName: string) => {
    setFavoriteStyles(prev => {
      const isAlreadyFavorite = prev.includes(styleName);
      if (isAlreadyFavorite) {
        return prev.filter(style => style !== styleName);
      }
      return [...prev, styleName];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">Style Community</h1>
            <button
              onClick={() => navigate('/my-posts')}
              className="text-sm text-gray-600 hover:text-black"
            >
              My Posts
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            {['trending', 'following'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'trending' | 'following')}
                className={`py-2 px-1 border-b-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={handleLike}
            onRate={handleRate}
            onComment={handleComment}
            favoriteStyles={favoriteStyles}
            onToggleFavoriteStyle={handleToggleFavoriteStyle}
          />
        ))}
      </main>

      <BottomNav />
    </div>
  );
}