import { useState, useRef, useEffect } from 'react';

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

interface ReelProps {
  reel: {
    id: string;
    userId: string;
    userName: string;
    videoUrl: string;
    thumbnailUrl: string;
    musicTitle: string;
    musicArtist: string;
    description: string;
    timestamp: number;
    likes: number;
    views: number;
    comments: Comment[];
    styleTags: StyleTag[];
  };
  isActive: boolean;
  onLike: (reelId: string) => void;
  onComment: (reelId: string, text: string) => void;
  favoriteStyles: string[];
  onToggleFavoriteStyle: (styleName: string) => void;
}

export default function ReelPost({
  reel,
  isActive,
  onLike,
  onComment,
  favoriteStyles,
  onToggleFavoriteStyle
}: ReelProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current && !hasError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error('Video playback error:', error);
            setHasError(true);
          });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, hasError]);

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Video playback error:', error);
              setHasError(true);
            });
        }
      }
    }
  };

  const handleVideoError = () => {
    console.error('Video failed to load:', reel.videoUrl);
    setHasError(true);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(reel.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="relative h-full bg-black">
      {/* Video or Fallback */}
      <div className="absolute inset-0" onClick={togglePlay}>
        {hasError ? (
          <img
            src={reel.thumbnailUrl}
            alt="Post thumbnail"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            className="h-full w-full object-cover"
            loop
            playsInline
            poster={reel.thumbnailUrl}
            onError={handleVideoError}
          />
        )}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50">
        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
          <button
            onClick={() => onLike(reel.id)}
            className="flex flex-col items-center"
          >
            <span className="text-2xl">❤️</span>
            <span className="text-white text-sm">{formatNumber(reel.likes)}</span>
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center"
          >
            <span className="text-2xl">💭</span>
            <span className="text-white text-sm">{reel.comments.length}</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-2xl">👁️</span>
            <span className="text-white text-sm">{formatNumber(reel.views)}</span>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              {reel.userName.charAt(0)}
            </div>
            <span className="text-white font-medium">{reel.userName}</span>
          </div>

          <p className="text-white mb-2">{reel.description}</p>

          {/* Music Info */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg">🎵</span>
            <div className="text-white/80 text-sm">
              {reel.musicTitle} · {reel.musicArtist}
            </div>
          </div>

          {/* Style Tags */}
          <div className="flex flex-wrap gap-2">
            {reel.styleTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => tag.type === 'style' && onToggleFavoriteStyle(tag.name)}
                className={`px-3 py-1 rounded-full text-sm ${
                  tag.type === 'style'
                    ? favoriteStyles.includes(tag.name)
                      ? 'bg-white text-black'
                      : 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-white/20 text-white'
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
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute inset-0 bg-black/80 z-50">
          <div className="h-full flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <h3 className="text-white font-medium">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {reel.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">
                    {comment.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white">
                      <span className="font-medium">{comment.userName}</span>{' '}
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmitComment} className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-white text-black rounded-full disabled:opacity-50"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}