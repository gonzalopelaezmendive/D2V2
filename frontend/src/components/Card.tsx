import React from 'react';

interface CardProps {
  children: React.ReactNode;
  emoji?: string;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, emoji, title, className = '' }) => {
  return (
    <div className={`card-d2v2 ${className}`}>
      {(emoji || title) && (
        <div className="flex items-center gap-4 mb-6">
          {emoji && <span className="text-5xl">{emoji}</span>}
          {title && <h2 className="text-2xl font-bold m-0">{title}</h2>}
        </div>
      )}
      {children}
    </div>
  );
};
