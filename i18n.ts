import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 支持的语言列表
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // 确保 locale 不为 undefined，使用默认语言
  const resolvedLocale = locale || defaultLocale;
  
  // 验证语言是否支持
  if (!locales.includes(resolvedLocale as Locale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
