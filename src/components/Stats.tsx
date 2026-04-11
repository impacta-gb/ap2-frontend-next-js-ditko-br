interface StatsProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  color: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink' | 'red';
  animated?: boolean;
}

const colorMap = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'bg-gradient-to-br from-blue-400 to-blue-500'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    icon: 'bg-gradient-to-br from-purple-400 to-purple-500'
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: 'bg-gradient-to-br from-emerald-400 to-emerald-500'
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    icon: 'bg-gradient-to-br from-orange-400 to-orange-500'
  },
  pink: {
    gradient: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400',
    icon: 'bg-gradient-to-br from-pink-400 to-pink-500'
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    icon: 'bg-gradient-to-br from-red-400 to-red-500'
  },
};

export const Stats = ({
  icon,
  label,
  value,
  trend,
  color,
  animated = false,
}: StatsProps) => {
  const colors = colorMap[color];
  const animationClass = animated ? 'animate-float' : '';

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 group ${animationClass}`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />
      
      {/* Decorative elements */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full blur-3xl group-hover:opacity-15 transition-opacity`} />
      
      {/* Content */}
      <div className="relative p-8 z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 ${colors.icon} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          {trend && (
            <span className={`text-sm font-bold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>
        
        <p className={`text-sm font-semibold ${colors.text} mb-3 group-hover:opacity-80 transition-opacity`}>
          {label}
        </p>
        
        <div className="flex items-baseline gap-2">
          <p className={`text-4xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
        </div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.gradient} w-0 group-hover:w-full transition-all duration-500`} />
      </div>
    </div>
  );
};
