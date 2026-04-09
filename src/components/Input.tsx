interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = ({
  label,
  error,
  helperText,
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 dark:bg-gray-700 dark:text-white font-medium ${
          error
            ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-offset-gray-800'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400'
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span> {error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2">{helperText}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = ({
  label,
  error,
  helperText,
  id,
  ...props
}: TextareaProps) => {
  const textareaId = id || `textarea-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 resize-vertical dark:bg-gray-700 dark:text-white font-medium ${
          error
            ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-offset-gray-800'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400'
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span> {error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-2">{helperText}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = ({ label, error, options, id, ...props }: SelectProps) => {
  const selectId = id || `select-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full px-4 py-2.5 pr-10 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 dark:bg-gray-700 dark:text-white font-medium appearance-none bg-white dark:bg-gray-700 cursor-pointer ${
            error
              ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-offset-gray-800'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400'
          }`}
          {...props}
        >
          <option value="">Selecione uma opção</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2 font-semibold flex items-center gap-1"><span>✕</span> {error}</p>}
    </div>
  );
};
