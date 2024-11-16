import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: any) => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreatePost }: CreatePostModalProps) {
  const [postType, setPostType] = useState<'discussion' | 'ai_outfit' | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !description) return;

    const newPost = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: localStorage.getItem('userName') || 'You',
      type: postType,
      mediaUrl: image,
      description,
      discussionTopic: postType === 'discussion' ? topic : undefined,
      timestamp: Date.now(),
      likes: 0,
      views: 0,
      comments: [],
      styleTags: []
    };

    onCreatePost(newPost);
    resetForm();
  };

  const resetForm = () => {
    setPostType(null);
    setImage(null);
    setDescription('');
    setTopic('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-lg w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Post</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {!postType ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPostType('discussion')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-colors"
            >
              <span className="block text-3xl mb-2">💭</span>
              <span className="font-medium">Start Discussion</span>
              <p className="text-sm text-gray-500 mt-2">
                Ask for style advice or discuss fashion trends
              </p>
            </button>

            <button
              onClick={() => setPostType('ai_outfit')}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-colors"
            >
              <span className="block text-3xl mb-2">✨</span>
              <span className="font-medium">Share AI Outfit</span>
              <p className="text-sm text-gray-500 mt-2">
                Share your AI-generated outfit with the community
              </p>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photo
              </label>
              <label className="block w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="h-full flex flex-col items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <span className="text-3xl mb-2">📷</span>
                      <span className="text-sm text-gray-500">Click to upload image</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            {postType === 'discussion' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discussion Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Style Advice, Celebrity Style"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  postType === 'discussion'
                    ? "What would you like to discuss? Ask for advice or share your thoughts..."
                    : "Share details about your AI-generated outfit..."
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setPostType(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!image || !description}
                className="px-6 py-2 bg-black text-white rounded-lg disabled:bg-gray-300"
              >
                Post
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}