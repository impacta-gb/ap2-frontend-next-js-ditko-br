import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Carregando...' }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-spin" 
               style={{ animationDuration: '3s' }} />
          
          {/* Middle ring */}
          <div className="absolute inset-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full animate-spin" 
               style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          
          {/* Inner circle */}
          <div className="absolute inset-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
            <Loader2 className="text-blue-600 dark:text-blue-400 animate-spin" size={28} />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-semibold animate-pulse text-lg">{message}</p>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  count?: number;
  circle?: boolean;
}

export const Skeleton = ({ className = '', count = 1, circle = false }: SkeletonProps) => {
  const baseClass = circle ? 'rounded-full' : 'rounded-xl';
  const skeletonElements = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${baseClass} animate-pulse ${className}`}
      style={{
        animation: 'shimmer 2s infinite',
        backgroundSize: '200% 100%',
        backgroundPosition: '0% 0%',
      }}
    />
  ));

  return <>{skeletonElements}</>;
};
