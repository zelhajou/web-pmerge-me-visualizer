import React from 'react';

/**
 * Reusable Button component
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'default',  // 'default', 'primary', 'secondary', 'danger'
  size = 'medium',      // 'small', 'medium', 'large'
  disabled = false,
  className = '',
  icon = null,
  ...props 
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
    secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
    danger: 'bg-red-100 hover:bg-red-200 text-red-800',
  };
  
  // Size styles
  const sizeStyles = {
    small: 'p-1 text-sm',
    medium: 'p-2',
    large: 'p-3 text-lg',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        rounded-md transition-colors duration-150
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;