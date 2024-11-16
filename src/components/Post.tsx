import { useState } from 'react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

interface StyleTag {
  name: string;
  type: 'style' | 'feeling';
}

interface PostProps {
  post: {
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
    styleTags: StyleTag[];
  };
  onLike: (postId: string) => void;
  onRate: (postId: string, rating: number) => void;
  onComment: (postId: string, text: string) => void;
  favoriteStyles: string[];
  onToggleFavoriteStyle: (styleName: string) => void;
}

export default function Post({ 
  post, 
  onLike, 
  onRate, 
  onComment,
  favoriteStyles,
  onToggleFavoriteStyle 
}: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const handleRate = (rating: number) => {
    if (!isRated) {
      onRate(post.id, rating);
      setUserRating(rating);
      setIsRated(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          {post.userName.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{post.userName}</p>
          <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
        </div>
      </div>

      {/* Post Image */}
      <img
        src={post.imageUrl}
        alt="Outfit"
        className="w-full aspect-square object-cover"
      />

      {/* Style Tags */}
      <div className="px-4 pt-4 flex flex-wrap gap-2">
        {post.styleTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => tag.type === 'style' && onToggleFavoriteStyle(tag.name)}
            className={`px-3 py-1 rounded-full text-sm ${
              tag.type === 'style'
                ? favoriteStyles.includes(tag.name)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
                : 'bg-gray-100 text-gray-600'
            } ${tag.type === 'style' ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {tag.type === 'style' ? '👔 ' : '💭 '}
            {tag.name}
            {tag.type === 'style' && (
              <span className="ml-1">
                {favoriteStyles.includes(tag.name) ? ' ✓' : ' +'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-2 text-gray-600 hover:text-black"
          >
            <span>❤️</span>
            <span>{post.likes}</span>
          </button>

          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`text-2xl ${
                  star <= (isRated ? userRating : Math.round(post.rating))
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                } ${!isRated ? 'hover:text-yellow-400' : ''}`}
                disabled={isRated}
              >
                ★
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              ({post.rating.toFixed(1)})
            </span>
          </div>
        </div>

        <p className="text-gray-900 mb-2">{post.description}</p>

        {/* Comments */}
        <div className="space-y-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-600 hover:text-black"
          >
            {post.comments.length} comments
          </button>

          {showComments && (
            <>
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm">
                      {comment.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{comment.userName}</span>{' '}
                        {comment.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(comment.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg disabled:bg-gray-300"
                >
                  Post
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}