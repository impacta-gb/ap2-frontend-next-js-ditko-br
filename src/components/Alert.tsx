import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  closeable?: boolean;
}

export const Alert = ({
  type,
  title,
  message,
  onClose,
  closeable = true,
}: AlertProps) => {
  const typeStyles = {
    success:
      'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:border-green-700 dark:text-green-200',
    error:
      'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-red-800 dark:from-red-900 dark:to-rose-900 dark:border-red-700 dark:text-red-200',
    warning:
      'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-yellow-800 dark:from-yellow-900 dark:to-amber-900 dark:border-yellow-700 dark:text-yellow-200',
    info: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-800 dark:from-blue-900 dark:to-cyan-900 dark:border-blue-700 dark:text-blue-200',
  };

  const iconStyles = {
    success: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400' },
    error: { icon: XCircle, color: 'text-red-600 dark:text-red-400' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600 dark:text-yellow-400' },
    info: { icon: Info, color: 'text-blue-600 dark:text-blue-400' },
  };

  const { icon: Icon, color } = iconStyles[type];

  return (
    <div
      className={`flex items-start gap-4 p-5 border-2 rounded-xl ${typeStyles[type]} transition-all duration-300`}
      role="alert"
    >
      <Icon className={`flex-shrink-0 mt-0.5 ${color}`} size={20} />
      <div className="flex-1">
        {title && <h3 className="font-bold mb-1 text-base">{title}</h3>}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {closeable && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-75 transition-opacity p-1"
          aria-label="Fechar alerta"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
