import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  emoji?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  emoji,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-lg font-bold text-d2v2-neutral-800">
          {emoji && <span className="text-2xl">{emoji}</span>}
          {label}
        </label>
      )}
      <input
        className={`input-d2v2 ${error ? 'border-d2v2-error focus:ring-d2v2-error/20' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-d2v2-error font-semibold flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};
