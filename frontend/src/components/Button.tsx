import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  emoji?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  emoji,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4';

  const variantClasses = {
    primary: 'bg-d2v2-primary text-white hover:bg-d2v2-primary/90 focus:ring-d2v2-primary/50',
    secondary: 'bg-d2v2-secondary text-white hover:bg-d2v2-secondary/90 focus:ring-d2v2-secondary/50',
    success: 'bg-d2v2-success text-white hover:bg-d2v2-success/90 focus:ring-d2v2-success/50',
    warning: 'bg-d2v2-warning text-d2v2-neutral-900 hover:bg-d2v2-warning/90 focus:ring-d2v2-warning/50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-base',
    md: 'px-6 py-4 text-lg',
    lg: 'px-8 py-5 text-xl',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {emoji && <span className="mr-2 text-2xl">{emoji}</span>}
      {children}
    </button>
  );
};
