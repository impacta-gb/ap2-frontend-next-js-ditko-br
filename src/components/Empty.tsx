import { Search, Package, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'package' | 'inbox' | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  animated?: boolean;
}

export const EmptyState = ({
  icon = 'search',
  title,
  description,
  action,
  animated = true,
}: EmptyStateProps) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    search: <Search size={64} />,
    package: <Package size={64} />,
    inbox: <Inbox size={64} />,
  };

  const iconElement = typeof icon === 'string' ? iconMap[icon] : icon;
  const animationClass = animated ? 'animate-float' : '';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`mb-6 text-gray-400 dark:text-gray-500 ${animationClass}`}>
        {iconElement}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm text-center">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
