'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useId, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = ({
  label,
  error,
  helperText,
  icon,
  showPasswordToggle = false,
  type = 'text',
  id,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedInputId = useId();
  const inputId = id || `input-${generatedInputId}`;
  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          id={inputId}
          className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} ${showPasswordToggle ? 'pr-12' : ''} border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 dark:bg-gray-700 dark:text-white font-medium bg-white placeholder-gray-400 dark:placeholder-gray-500 ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-600 dark:border-red-400 dark:focus:ring-offset-gray-800 dark:focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400'
          }`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-semibold flex items-center gap-1">
          <span>✕</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{helperText}</p>
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
  const generatedTextareaId = useId();
  const textareaId = id || `textarea-${generatedTextareaId}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 resize-vertical dark:bg-gray-700 dark:text-white font-medium bg-white placeholder-gray-400 dark:placeholder-gray-500 ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-600 dark:border-red-400 dark:focus:ring-offset-gray-800 dark:focus:ring-red-400'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400'
        }`}
        {...props}
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-semibold flex items-center gap-1">
          <span>✕</span> {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{helperText}</p>
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
  const generatedSelectId = useId();
  const selectId = id || `select-${generatedSelectId}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 dark:bg-gray-700 dark:text-white font-medium appearance-none bg-white dark:bg-gray-700 cursor-pointer ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-600 dark:border-red-400 dark:focus:ring-offset-gray-800 dark:focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-600 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400'
          }`}
          {...props}
        >
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
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-semibold flex items-center gap-1">
          <span>✕</span> {error}
        </p>
      )}
    </div>
  );
};
