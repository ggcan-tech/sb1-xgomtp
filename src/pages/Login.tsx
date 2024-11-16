import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialLoginButton from '../components/SocialLoginButton';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.email && formData.password) {
      const isFirstLogin = !localStorage.getItem('hasLoggedIn');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('hasLoggedIn', 'true');
      
      navigate(isFirstLogin ? '/places-selection' : '/home');
    }
  };

  const handleSocialLogin = (provider: string) => {
    const isFirstLogin = !localStorage.getItem('hasLoggedIn');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('hasLoggedIn', 'true');
    
    navigate(isFirstLogin ? '/places-selection' : '/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Welcome Back!
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <input
                type="email"
                name="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black text-black"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black text-black"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => alert('Reset link will be sent if email exists')}
                className="text-sm font-medium text-black hover:text-gray-900"
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Login
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
              <SocialLoginButton provider="google" onClick={handleSocialLogin} />
              <SocialLoginButton provider="apple" onClick={handleSocialLogin} />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="font-medium text-black hover:text-gray-900"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}