import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin" />
          <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full" />
          <Loader2 className="absolute inset-0 m-auto text-blue-600 dark:text-blue-400 animate-spin" size={32} />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-semibold animate-pulse">Carregando...</p>
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl animate-shimmer ${className}`}
    />
  );
};
