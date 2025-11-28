import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {

  const baseStyles = "relative font-mono uppercase tracking-widest transition-all duration-200 border border-nothing-dark disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden rounded-none flex items-center justify-center";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-6 py-3"
  };

  const variants = {
    primary: "bg-nothing-dark text-nothing-base hover:bg-nothing-accent hover:border-nothing-accent hover:text-white",
    secondary: "bg-transparent text-nothing-dark hover:bg-nothing-dark hover:text-nothing-base",
    danger: "bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Glitch/Hover Overlay Effect */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-75 pointer-events-none" />

      <div className="flex items-center justify-center gap-2 relative z-10">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </div>
    </button>
  );
};