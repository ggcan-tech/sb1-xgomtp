import React from 'react';

interface SocialLoginButtonProps {
  provider: 'google' | 'apple';
  onClick: (provider: string) => void;
}

export default function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  return (
    <button 
      onClick={() => onClick(provider)}
      className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
    >
      {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}