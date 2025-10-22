# Polymarket Hype Radar

你可以在这里快速的体验demo：https://polymarket-hype-radar.vercel.app/

> 实时捕捉预测市场的「真热度」，用数据驱动你的交易决策

一个免费、轻量、透明的 Polymarket 热度追踪工具。它将 24h 交易量、价格变化与搜索筛选组合成清晰的信号面板，帮助你快速发现趋势、验证想法、把握机会。

## 为什么值得用

- 直击核心指标：24h 成交量与 24h 涨跌，最能反映近期资金流向与情绪变化。
- 实时刷新：每 30 秒自动更新，无需手动操作，信息优势不掉线。
- 极简高效：无需登录、无广告，开箱即用，专注于「能赚钱」的洞察。

## 能如何赚钱（合理、可执行）

- 趋势跟随（热点榜）：
  - 观察 24h 成交量快速抬升的市场，顺势参与高流动性赛道，降低滑点，提高进出场效率。
- 事件驱动（涨幅榜）：
  - 24h 涨跌幅快速拉升通常伴随新闻催化或观点反转，适合短线跟随或快速博弈。
- 价差套利（跨市场）：
  - 结合 Polymarket 官方页面，查找相关事件的不同市场，比较价格偏差，捕捉短期错定价。
- 分类轮动（搜索+榜单）：
  - 通过搜索特定分类（如「政治」「科技」）+ 热度榜，挖掘类别内轮动机会。

提示：以上为一般性策略思路，不构成投资建议；请做好仓位管理与风险控制。

## 功能一览

- 热门榜：按 24 小时交易量排序（更能反映真实参与度与流动性）
- 涨幅榜：按 24 小时价格变化排序（捕捉短线情绪与趋势反转）
- 实时搜索：按市场名称或分类筛选（快速定位想要的主题）
- 自动刷新：每 30 秒自动更新数据（信息不滞后）
- 一键跳转：点击市场名称直达 Polymarket 官方页面

## 技术栈

- 框架：Next.js 15（App Router）
- 语言：TypeScript
- 样式：Tailwind CSS
- 数据获取：SWR（自动缓存与刷新）
- 数据来源：Polymarket Gamma API
- 部署：Vercel 或本地运行

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发环境（默认 3000）
npm run dev
# 或指定端口（例如 3003）
npm run dev -- -p 3003

# 构建与启动生产版本
npm run build
npm start
# 或指定端口
PORT=3003 npm start
```

访问本地示例：`http://localhost:3003`

## 如何使用

1. 首页顶部切换「热门榜 / 涨幅榜」，快速定位最值得关注的市场。
2. 使用搜索栏输入关键词或分类（如「politics」「tech」），缩小范围。
3. 观察成交量与涨跌幅变化，结合自己的交易框架做出决策。
4. 点击市场名称直达 Polymarket 官方页面，进一步查看细节与深度信息。

## API 说明

使用 Polymarket 官方公开 API：

```
https://gamma-api.polymarket.com/markets?closed=false&limit=100
```

- `closed=false` 只获取活跃市场
- `limit=100` 返回 100 个市场（可在 `app/page.tsx` 调整）
- 本应用默认每 30 秒自动刷新一次数据

## 常见问题

- 需要 API Key 吗？不需要，Polymarket API 公开免费。
- 可以自定义刷新频率吗？可以，在 `app/page.tsx` 中调整 `refreshInterval`（毫秒）。
- 可以增加市场数量吗？可以，适度调高 `limit`（建议不超过 200，避免信息噪声过大）。

## 联系开发者

- Twitter（X）：https://x.com/hunterweb303
- Telegram：t.me/dsa885

欢迎反馈需求、交流策略或提出改进建议。

## 许可证

MIT License — 自由使用与修改，欢迎二次开发与商用。

---

Made with ❤️ for the Polymarket community
