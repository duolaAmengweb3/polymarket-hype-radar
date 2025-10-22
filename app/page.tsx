'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Market, TabType } from '@/lib/types';
import { fetcher } from '@/lib/api';
import { sortByVolume24h, sortByPriceChange, filterMarkets } from '@/lib/utils';
import MarketTable from '@/components/MarketTable';
import SearchBar from '@/components/SearchBar';
import TabSwitcher from '@/components/TabSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/Provider';

const API_URL = '/api/markets?limit=100';

export default function Home() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>('hot');
  const [searchQuery, setSearchQuery] = useState('');

  // 使用 SWR 自动刷新数据（每 30 秒）
  const { data, error, isLoading } = useSWR<Market[]>(API_URL, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  // 根据当前标签排序和筛选市场
  const displayedMarkets = useMemo(() => {
    if (!data) return [];

    // 先根据标签排序
    const sorted = activeTab === 'hot'
      ? sortByVolume24h(data)
      : sortByPriceChange(data);

    // 再应用搜索过滤
    return filterMarkets(sorted, searchQuery);
  }, [data, activeTab, searchQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img src="/logo.png" alt="Polymarket Hype Radar" className="w-12 h-12 object-cover" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t.app.title}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {t.app.subtitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {t.app.realtime}
                </span>
                {data && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {data.length} {t.app.markets}
                  </span>
                )}
              </div>

              {/* 社交媒体和语言切换 */}
              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Telegram */}
                <a
                  href="https://t.me/dsa885"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title={t.social.telegram}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://x.com/hunterweb303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title={t.social.twitter}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选区域 */}
        <div className="mb-8 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.search.placeholder}
          />
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div role="status" className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-blue-400 opacity-20"></div>
              </div>
              <p className="text-gray-600 font-medium">{t.app.loading}</p>
              <p className="text-sm text-gray-500">{t.app.loadingSubtitle}</p>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-red-600 font-bold text-lg">{t.app.loadError}</p>
                <p className="text-red-500 text-sm mt-2">
                  {error.message || t.app.loadErrorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 市场表格 */}
        {!isLoading && !error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <MarketTable
              markets={displayedMarkets}
              showPriceChange={activeTab === 'trending'}
            />
          </div>
        )}

        {/* 统计信息 */}
        {!isLoading && !error && data && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {displayedMarkets.length}
                </span>
                <span className="text-sm text-gray-600">{t.app.markets}</span>
              </div>
              {searchQuery && (
                <>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t.app.search}:</span>
                    <span className="text-sm font-medium text-gray-900">&quot;{searchQuery}&quot;</span>
                  </div>
                </>
              )}
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{t.app.dataSource}</span>
                <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Polymarket
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 页脚 */}
      <footer className="mt-20 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {t.footer.openSource}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                {t.footer.free}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {t.footer.dataFrom}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://docs.polymarket.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.footer.apiDocs}
              </a>
              <a
                href="https://github.com/duolaAmengweb3/polymarket-hype-radar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                {t.footer.github}
              </a>
            </div>
            <p className="text-xs text-gray-500">
              {t.footer.madeWith}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
