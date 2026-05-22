import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-md relative overflow-hidden group';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 focus:ring-blue-500 active:from-blue-800 active:to-purple-800 shadow-lg hover:shadow-xl',
    secondary:
      'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:text-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:ring-gray-500 active:from-gray-400 active:to-gray-500 shadow-md',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 dark:from-red-700 dark:to-rose-700 focus:ring-red-500 active:from-red-800 active:to-rose-800 shadow-lg',
    success:
      'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 dark:from-emerald-700 dark:to-green-700 focus:ring-emerald-500 active:from-emerald-800 active:to-green-800 shadow-lg',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 focus:ring-blue-500 active:bg-blue-100 dark:active:bg-blue-900 shadow-md',
    ghost:
      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500 active:bg-gray-200 dark:active:bg-gray-700 shadow-none',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
    xl: 'px-8 py-4 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const iconElement = icon ? (
    loading ? <Loader2 size={18} className="animate-spin" /> : icon
  ) : loading ? (
    <Loader2 size={18} className="animate-spin" />
  ) : null;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {iconPosition === 'left' && iconElement}
        {children}
        {iconPosition === 'right' && iconElement}
      </span>
    </button>
  );
};
