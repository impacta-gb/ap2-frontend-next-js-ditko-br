interface DividerProps {
  text?: string;
  variant?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  className?: string;
}

export const Divider = ({ 
  text, 
  variant = 'solid',
  className = ''
}: DividerProps) => {
  const lineStyles = {
    solid: 'border-t border-gray-300 dark:border-gray-600',
    dashed: 'border-t-2 border-dashed border-gray-300 dark:border-gray-600',
    dotted: 'border-t-2 border-dotted border-gray-300 dark:border-gray-600',
    gradient: 'h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent'
  };

  if (text) {
    return (
      <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className={`flex-1 ${lineStyles[variant]}`} />
        <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
          {text}
        </span>
        <div className={`flex-1 ${lineStyles[variant]}`} />
      </div>
    );
  }

  return <div className={`my-6 ${lineStyles[variant]} ${className}`} />;
};
