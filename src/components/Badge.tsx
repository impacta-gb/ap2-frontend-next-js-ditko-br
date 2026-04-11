interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

export const Badge = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  animated = false,
  className = '',
}: BadgeProps) => {
  const variantStyles = {
    success:
      'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600 shadow-md hover:shadow-lg',
    warning:
      'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:from-amber-900/40 dark:to-yellow-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-600 shadow-md hover:shadow-lg',
    danger:
      'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-200 border border-red-300 dark:border-red-600 shadow-md hover:shadow-lg',
    info:
      'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40 dark:text-blue-200 border border-blue-300 dark:border-blue-600 shadow-md hover:shadow-lg',
    default:
      'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-700 dark:to-slate-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg',
    primary:
      'bg-gradient-to-r from-blue-500 to-purple-500 text-white dark:from-blue-600 dark:to-purple-600 border border-blue-400 dark:border-blue-500 shadow-lg hover:shadow-xl',
    secondary:
      'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/40 dark:to-pink-900/40 dark:text-purple-200 border border-purple-300 dark:border-purple-600 shadow-md hover:shadow-lg'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-300 cursor-default ${sizeStyles[size]} ${variantStyles[variant]} ${animationClass} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </span>
  );
};
