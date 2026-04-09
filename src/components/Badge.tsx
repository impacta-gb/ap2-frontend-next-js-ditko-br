interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export const Badge = ({
  label,
  variant = 'default',
  className = '',
}: BadgeProps) => {
  const variantStyles = {
    success:
      'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-200 border border-green-300 dark:border-green-700',
    warning:
      'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 dark:from-yellow-900 dark:to-amber-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700',
    danger:
      'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900 dark:to-rose-900 dark:text-red-200 border border-red-300 dark:border-red-700',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900 dark:to-cyan-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700',
    default:
      'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-700 dark:to-slate-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${variantStyles[variant]} ${className} shadow-sm`}
    >
      {label}
    </span>
  );
};
