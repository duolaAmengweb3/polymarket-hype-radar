# 🌐 国际化（i18n）配置完成

## ✅ 已完成的功能

### 1. 基础设施
- ✅ 安装 `next-intl` 库
- ✅ 创建语言文件：`messages/en.json` 和 `messages/zh.json`
- ✅ 创建 i18n Provider (`lib/i18n/Provider.tsx`)
- ✅ 创建语言切换器组件 (`components/LanguageSwitcher.tsx`)

### 2. 语言支持
- ✅ 英文（默认语言）
- ✅ 中文（简体）

### 3. 功能特性
- ✅ 语言切换器显示在导航栏右侧
- ✅ 语言偏好保存到 localStorage
- ✅ 页面刷新后保持语言选择
- ✅ 优雅的下拉菜单设计
- ✅ 国旗图标显示

## 📍 当前状态

### 已国际化的部分
- ✅ 导航栏实时状态标签
- ✅ 市场数量标签
- ✅ 社交媒体图标 tooltip

### 需要完成国际化的部分
以下部分需要继续更新以使用翻译：

```typescript
// 需要在 page.tsx 中更新的部分：
1. 页面标题和副标题 (line 49-54)
2. 搜索框占位符 (line 112)
3. 标签页文本 (TabSwitcher)
4. 加载状态文本 (line 120-128)
5. 错误状态文本 (line 133-145)
6. 统计信息文本 (line 162-186)
7. 页脚文本 (line 192-248)
```

## 🚀 快速使用指南

### 1. 在组件中使用翻译

```typescript
'use client';

import { useI18n } from '@/lib/i18n/Provider';

export default function MyComponent() {
  const { t, locale } = useI18n();

  return (
    <div>
      <h1>{t.app.title}</h1>
      <p>Current language: {locale}</p>
    </div>
  );
}
```

### 2. 添加新的翻译文本

**英文** (`messages/en.json`):
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

**中文** (`messages/zh.json`):
```json
{
  "mySection": {
    "title": "我的标题",
    "description": "我的描述"
  }
}
```

### 3. 使用翻译
```typescript
const { t } = useI18n();
<h1>{t.mySection.title}</h1>
```

## 📦 翻译文件结构

### messages/en.json
```json
{
  "app": {
    "title": "Polymarket Hype Radar",
    "subtitle": "🔥 Real-time tracking...",
    "loading": "Loading market data...",
    "realtime": "● Live",
    "markets": "markets"
  },
  "search": {
    "placeholder": "🔍 Search..."
  },
  "tabs": {
    "hot": "🔥 Hot",
    "trending": "📈 Trending"
  },
  "table": {
    "rank": "#",
    "market": "Market",
    "category": "Category",
    "volume24h": "24h Volume"
  },
  "footer": {
    "openSource": "Open Source Project",
    "free": "Completely Free"
  },
  "social": {
    "telegram": "Telegram",
    "twitter": "Twitter/X"
  }
}
```

## 🎨 语言切换器位置

语言切换器已添加到导航栏右侧，位于：
```
[Logo] [Title]    [Live] [100 markets] [🇺🇸 Language] [Telegram] [Twitter]
```

## 🔧 继续完成国际化的步骤

### 步骤1：更新页面标题
```typescript
// app/page.tsx line 49-54
<h1 className="text-3xl...">
  {t.app.title}
</h1>
<p className="text-sm...">
  {t.app.subtitle}
</p>
```

### 步骤2：更新搜索框
```typescript
// app/page.tsx line 112
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder={t.search.placeholder}
/>
```

### 步骤3：更新 TabSwitcher 组件
修改 `components/TabSwitcher.tsx` 使用翻译：

```typescript
'use client';

import { TabType } from '@/lib/types';
import { useI18n } from '@/lib/i18n/Provider';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const { t } = useI18n();

  const tabs: { id: TabType; label: string }[] = [
    { id: 'hot', label: t.tabs.hot },
    { id: 'trending', label: t.tabs.trending },
  ];

  // ... rest of the component
}
```

### 步骤4：更新 MarketTable 组件
修改 `components/MarketTable.tsx` 使用翻译：

```typescript
'use client';

import { Market } from '@/lib/types';
import { useI18n } from '@/lib/i18n/Provider';
// ... other imports

export default function MarketTable({ markets, showPriceChange }: MarketTableProps) {
  const { t } = useI18n();

  if (markets.length === 0) {
    return (
      <div className="...">
        <p>{t.table.noData}</p>
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>{t.table.rank}</th>
          <th>{t.table.market}</th>
          <th>{t.table.category}</th>
          {showPriceChange ? (
            <th>{t.table.priceChange24h}</th>
          ) : (
            <>
              <th>{t.table.volume24h}</th>
              <th>{t.table.volume7d}</th>
            </>
          )}
          <th>{t.table.endTime}</th>
        </tr>
      </thead>
      {/* ... */}
    </table>
  );
}
```

### 步骤5：更新加载和错误状态
```typescript
// Loading state
{isLoading && (
  <div className="...">
    <p>{t.app.loading}</p>
    <p>{t.app.loadingSubtitle}</p>
  </div>
)}

// Error state
{error && (
  <div className="...">
    <p>{t.app.loadError}</p>
    <p>{error.message || t.app.loadErrorMessage}</p>
  </div>
)}
```

### 步骤6：更新页脚
```typescript
<footer className="...">
  <span>{t.footer.openSource}</span>
  <span>{t.footer.free}</span>
  <span>{t.footer.dataFrom}</span>
  <a href="...">{t.footer.apiDocs}</a>
  <a href="...">{t.footer.github}</a>
  <p>{t.footer.madeWith}</p>
</footer>
```

## 🌐 测试国际化

1. **打开应用**：访问 `http://localhost:3003`
2. **查看语言切换器**：应该在导航栏右侧看到 🇺🇸 图标
3. **点击切换器**：下拉菜单显示 English 和 中文
4. **选择中文**：页面应立即切换到中文（已国际化的部分）
5. **刷新页面**：语言偏好应该保持
6. **检查 localStorage**：打开开发者工具 → Application → Local Storage → 应该看到 `preferredLocale: "zh"` 或 `"en"`

## 📝 注意事项

1. **服务端渲染**：当前实现使用客户端 Context，避免了 SSR 复杂性
2. **默认语言**：默认为英文（en），首次访问时显示英文
3. **语言检测**：不自动检测浏览器语言，用户需手动选择
4. **SEO**：当前实现对SEO不友好，如需SEO，建议使用 next-intl 的完整实现（需要修改路由结构）

## 🎯 下一步优化建议

1. **完成所有文本的国际化**：参考上面的步骤1-6
2. **添加更多语言**：复制 `messages/en.json`，翻译后创建新文件
3. **自动语言检测**：在 Provider 中添加浏览器语言检测
4. **URL 路由**：实现 `/en/` 和 `/zh/` 路由（需要重构）
5. **SEO优化**：添加 hreflang 标签

## 🐛 已知问题

无

## ✅ 验证清单

- [x] 语言切换器显示正确
- [x] 点击切换器显示下拉菜单
- [x] 选择语言后立即切换
- [x] 语言偏好保存到 localStorage
- [x] 页面刷新后保持语言选择
- [ ] 所有文本都使用翻译（需继续完成）
- [ ] 测试在不同浏览器中的兼容性

---

**状态**：国际化基础设施已完成 ✅
**下一步**：完成所有组件的文本翻译
**预计时间**：30-60分钟（根据上面的步骤逐个组件更新）
