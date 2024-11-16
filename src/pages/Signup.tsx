import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialLoginButton from '../components/SocialLoginButton';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Store user data and proceed
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('hasLoggedIn', 'true');
    
    navigate('/places-selection');
  };

  const handleSocialSignup = (provider: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('hasLoggedIn', 'true');
    navigate('/places-selection');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Create Account
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm Password"
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <SocialLoginButton provider="google" onClick={handleSocialSignup} />
              <SocialLoginButton provider="apple" onClick={handleSocialSignup} />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="font-medium text-black hover:text-gray-900"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}