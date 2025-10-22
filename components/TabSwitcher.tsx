'use client';

import { TabType } from '@/lib/types';
import { useI18n } from '@/lib/i18n/Provider';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const { t } = useI18n();

  return (
    <div className="flex gap-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
      <button
        onClick={() => onTabChange('hot')}
        className={`flex-1 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
          activeTab === 'hot'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          {t.tabs.hot}
        </span>
      </button>
      <button
        onClick={() => onTabChange('trending')}
        className={`flex-1 px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
          activeTab === 'trending'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          {t.tabs.trending}
        </span>
      </button>
    </div>
  );
}
