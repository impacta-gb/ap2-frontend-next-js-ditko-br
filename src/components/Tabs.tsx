interface TabsProps {
  tabs: Array<{
    label: string;
    id: string;
  }>;
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
}: TabsProps) => {
  const baseStyles = 'transition-all duration-300 font-semibold';
  
  const tabVariants = {
    default: {
      button: `px-4 py-2.5 rounded-lg ${baseStyles}`,
      active: 'bg-blue-600 text-white shadow-lg',
      inactive: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
    },
    pills: {
      button: `px-4 py-2 rounded-full ${baseStyles}`,
      active: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md',
      inactive: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
    },
    underline: {
      button: `px-4 py-2.5 border-b-2 ${baseStyles}`,
      active: 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400',
      inactive: 'border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600',
    },
  };

  const variant_styles = tabVariants[variant];

  return (
    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`${variant_styles.button} ${
            activeTab === tab.id ? variant_styles.active : variant_styles.inactive
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
