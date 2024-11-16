import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="relative h-72 mb-8">
            <div className="absolute inset-0 bg-black/10 rounded-2xl" />
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"
              alt="Fashion"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              Find Your <br /> Perfect Style
            </h1>
            <p className="text-gray-600">
              AI-powered outfit recommendations tailored to your unique style
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-4 px-6 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
            >
              Create Account
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 px-6 border-2 border-gray-200 text-black rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}