'use client';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'edit' | 'delete' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled = false }: ButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'edit':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'delete':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-900';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`px-4 py-2 rounded-lg ${getButtonStyle()} transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;