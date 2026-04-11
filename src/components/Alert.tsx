import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  closeable?: boolean;
  animated?: boolean;
  showIcon?: boolean;
}

export const Alert = ({
  type,
  title,
  message,
  onClose,
  closeable = true,
  animated = false,
  showIcon = true,
}: AlertProps) => {
  const typeStyles = {
    success:
      'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800 dark:from-emerald-900/30 dark:to-green-900/30 dark:border-emerald-700 dark:text-emerald-200 shadow-lg hover:shadow-xl',
    error:
      'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800 dark:from-red-900/30 dark:to-rose-900/30 dark:border-red-700 dark:text-red-200 shadow-lg hover:shadow-xl',
    warning:
      'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 text-amber-800 dark:from-amber-900/30 dark:to-yellow-900/30 dark:border-amber-700 dark:text-amber-200 shadow-lg hover:shadow-xl',
    info:
      'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-800 dark:from-blue-900/30 dark:to-cyan-900/30 dark:border-blue-700 dark:text-blue-200 shadow-lg hover:shadow-xl',
  };

  const iconStyles = {
    success: { icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' },
    error: { icon: XCircle, color: 'text-red-600 dark:text-red-400' },
    warning: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400' },
    info: { icon: Info, color: 'text-blue-600 dark:text-blue-400' },
  };

  const { icon: Icon, color } = iconStyles[type];
  const animationClass = animated ? 'animate-slide-up' : '';

  return (
    <div
      className={`flex items-start gap-4 p-5 border-l-4 rounded-lg ${typeStyles[type]} transition-all duration-300 ${animationClass}`}
      role="alert"
    >
      {showIcon && <Icon className={`flex-shrink-0 mt-0.5 ${color}`} size={22} />}
      <div className="flex-1">
        {title && <h3 className="font-bold mb-1 text-base">{title}</h3>}
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      {closeable && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-60 transition-opacity p-1 hover:bg-white/20 rounded-md"
          aria-label="Fechar alerta"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
