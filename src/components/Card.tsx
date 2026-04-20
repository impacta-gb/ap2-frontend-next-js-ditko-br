interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  ...props
}: CardProps) => {
  const hoverClass = hover ? 'hover:shadow-2xl hover:-translate-y-2' : '';
  const gradientClass = gradient ? 'bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20' : 'bg-white dark:bg-gray-800';
  
  return (
    <div
      {...props}
      className={`${gradientClass} rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'colored';
  color?: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink';
}

export const CardHeader = ({ 
  children, 
  className = '', 
  variant = 'default',
  color = 'blue'
}: CardHeaderProps) => {
  const variantStyles = {
    default: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600',
    gradient: `bg-gradient-to-r from-${color}-600 to-${color}-700 text-white dark:from-${color}-700 dark:to-${color}-800`,
    colored: `bg-gradient-to-r from-${color}-100 to-${color}-50 dark:from-${color}-900/30 dark:to-${color}-800/20 border-b-2 border-${color}-400 dark:border-${color}-600`
  };
  
  return (
    <div className={`px-6 py-5 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const CardBody = ({ 
  children, 
  className = '', 
  padding = 'md'
}: CardBodyProps) => {
  const paddingStyles = {
    sm: 'px-4 py-3',
    md: 'px-6 py-5',
    lg: 'px-8 py-7'
  };
  
  return <div className={`${paddingStyles[padding]} ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  background?: 'default' | 'light' | 'gradient';
}

export const CardFooter = ({ 
  children, 
  className = '', 
  divider = true,
  background = 'default'
}: CardFooterProps) => {
  const bgStyles = {
    default: 'bg-gray-50 dark:bg-gray-700',
    light: 'bg-white/50 dark:bg-gray-800/50',
    gradient: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600'
  };

  const borderClass = divider ? 'border-t border-gray-200 dark:border-gray-600' : '';

  return (
    <div
      className={`px-6 py-5 ${bgStyles[background]} ${borderClass} rounded-b-2xl ${className}`}
    >
      {children}
    </div>
  );
};
