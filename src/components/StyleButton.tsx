import React from 'react';

interface StyleButtonProps {
  style: string;
  isSelected: boolean;
  onClick: (style: string) => void;
}

export default function StyleButton({ style, isSelected, onClick }: StyleButtonProps) {
  return (
    <button
      onClick={() => onClick(style)}
      className={`p-4 rounded-xl text-left transition-colors ${
        isSelected
          ? 'bg-black text-white'
          : 'bg-gray-100 text-black hover:bg-gray-200'
      }`}
    >
      {style}
    </button>
  );
}