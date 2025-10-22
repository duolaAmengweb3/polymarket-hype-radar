# 部署指南

## 部署到 Vercel（推荐）

### 方式一：使用 Vercel CLI（最快）

```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 进入项目目录
cd /Users/huan/Desktop/预测市场/polymarket/polymarket-hype-radar

# 4. 部署到生产环境
vercel --prod
```

按照提示操作：
- 选择或创建项目
- 确认项目设置
- 等待部署完成
- 获得生产环境 URL

### 方式二：通过 GitHub 自动部署

1. **创建 GitHub 仓库**
```bash
cd /Users/huan/Desktop/预测市场/polymarket/polymarket-hype-radar
git init
git add .
git commit -m "Initial commit: Polymarket Hype Radar"
git branch -M main
git remote add origin https://github.com/你的用户名/polymarket-hype-radar.git
git push -u origin main
```

2. **连接 Vercel**
   - 访问 https://vercel.com
   - 登录你的账号
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 选择刚创建的仓库
   - 保持默认配置
   - 点击 "Deploy"

3. **自动部署**
   - 每次 push 到 main 分支会自动部署
   - Pull Request 会自动生成预览环境

## 本地开发和测试

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
npm start
```

### Lint 检查
```bash
npm run lint
```

## 环境变量（可选）

本项目不需要环境变量，API 完全公开。

如果未来需要添加环境变量：

1. 创建 `.env.local` 文件
2. 在 Vercel 项目设置中添加环境变量
3. 重新部署

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 数据正常加载（检查 API 请求）
- [ ] 热门榜显示正确
- [ ] 涨幅榜显示正确
- [ ] 搜索功能正常
- [ ] 点击市场链接跳转正确
- [ ] 移动端显示正常
- [ ] 30 秒自动刷新正常

## 性能优化建议

1. **启用 Vercel Analytics**（可选）
   - 在 Vercel 项目设置中启用
   - 查看访问量和性能指标

2. **缓存优化**
   - API 响应已配置 30 秒缓存
   - SWR 自动处理客户端缓存

3. **SEO 优化**
   - 已配置基础 meta 标签
   - 可以添加 sitemap.xml
   - 可以添加 robots.txt

## 监控和日志

### 查看部署日志
```bash
vercel logs [deployment-url]
```

### 查看构建日志
在 Vercel Dashboard -> Deployments -> 选择部署 -> Build Logs

## 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 输入你的域名
3. 按照提示配置 DNS
4. 等待 SSL 证书自动生成

## 成本估算

- **Vercel 免费层**：完全够用
  - 100GB 带宽/月
  - 无限请求
  - 自动 HTTPS
  - 全球 CDN

- **预计使用**：
  - 每次访问 ~100KB
  - 1000 次访问 ≈ 100MB
  - 免费层可支持 100万+ 访问/月

## 常见问题

### Q: 部署失败怎么办？
A: 检查构建日志，通常是依赖问题或类型错误。

### Q: API 请求失败？
A: 检查网络连接和 Polymarket API 状态。

### Q: 如何回滚部署？
A: 在 Vercel Dashboard 中选择之前的部署，点击 "Promote to Production"。

### Q: 如何查看访问统计？
A: 在 Vercel Dashboard 中启用 Analytics 功能。

## 更新部署

### CLI 更新
```bash
# 修改代码后
git add .
git commit -m "Update: 描述更改"
git push

# 或者直接使用 Vercel CLI
vercel --prod
```

### 自动更新（GitHub）
只需 push 代码到 GitHub，Vercel 会自动部署。

## 技术支持

如有问题，请查看：
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- 项目 README.md

---

祝部署顺利！🚀
