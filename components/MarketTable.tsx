'use client';

import { Market } from '@/lib/types';
import { formatVolume, formatPriceChange, formatDate, getMarketUrl } from '@/lib/utils';
import { useI18n } from '@/lib/i18n/Provider';

interface MarketTableProps {
  markets: Market[];
  showPriceChange?: boolean;
}

export default function MarketTable({ markets, showPriceChange = false }: MarketTableProps) {
  const { t } = useI18n();
  if (markets.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-100 rounded-full p-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-lg">{t.table.noData}</p>
            <p className="text-gray-500 text-sm mt-1">{t.table.noDataSubtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t.table.rank}
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t.table.market}
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t.table.category}
            </th>
            {showPriceChange ? (
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t.table.priceChange24h}
              </th>
            ) : (
              <>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {t.table.volume24h}
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                  {t.table.volume7d}
                </th>
              </>
            )}
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
              {t.table.endTime}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {markets.map((market, index) => (
            <tr
              key={market.id}
              className="hover:bg-blue-50/50 transition-colors duration-150 group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-sm">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-4">
                <a
                  href={getMarketUrl(market.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group-hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {market.image && (
                      <img
                        src={market.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {market.question}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(market.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                  {market.category}
                </span>
              </td>
              {showPriceChange ? (
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm ${
                        Number(market.oneDayPriceChange) >= 0
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      }`}
                    >
                      {Number(market.oneDayPriceChange) >= 0 ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {formatPriceChange(market.oneDayPriceChange)}
                    </span>
                  </div>
                </td>
              ) : (
                <>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-900">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      {formatVolume(market.volume24hr)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <span className="text-sm font-medium text-gray-600">
                      {formatVolume(market.volume1wk)}
                    </span>
                  </td>
                </>
              )}
              <td className="px-6 py-4 hidden lg:table-cell">
                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(market.endDate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
