import React, { ButtonHTMLAttributes } from 'react';
import { useStore } from '@/store';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  disabled = false,
  children,
  ...props
}) => {
  const { setShowModal, setErrorMessage } = useStore();

  const handleClick = () => {
    props.onClick && props.onClick();
  };

  const buttonClasses = `
    px-4
    py-2
    rounded-md
    font-medium
    ${
      variant === 'primary'
        ? 'bg-blue-500 text-white'
        : variant === 'secondary'
        ? 'bg-gray-300 text-gray-700'
        : variant === 'danger'
        ? 'bg-red-500 text-white'
        : ''
    }
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    ${isLoading ? 'animate-pulse' : ''}
    ${props.className}
  `;

  return (
    <button
      type={props.type || 'button'}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;