# RaytonX Learn

RaytonX Learn 是一个基于 Next.js 构建的课程站点，挂载在 `/courses` 路径下，后端服务使用 Supabase。

线上地址：https://www.raytonx.com/courses

## Tech Stack

- Next.js 16
- Tailwind CSS / Shadcn UI
- Supabase
- Vercel

## Local Development

安装依赖后启动开发服务器：

```bash
pnpm install
pnpm dev
```

默认开发地址：

```text
http://localhost:3000/courses
```

项目在 `next.config.ts` 中配置了：

- `basePath: "/courses"`
- `assetPrefix: "/courses"`
- 根路径 `/` 永久重定向到 `/courses`

## Environment Variables

本项目依赖以下环境变量：

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_BASE_PATH=/courses
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

说明：

- `NEXT_PUBLIC_SITE_URL` 用于 canonical、Open Graph、sitemap 等绝对地址生成。
- `NEXT_PUBLIC_BASE_PATH` 通常为 `/courses`。
- `SUPABASE_SERVICE_ROLE_KEY` 仅服务端使用，不应暴露到客户端。

## 内容管理

### 结构化数据

课程和课时存放在 supabase 中，当前区分为不同状态：

- `published`：正式发布，可用于 SEO、sitemap、静态页面生成。
- `coming_soon`：可在列表中展示“敬请期待”，但不应生成静态课时页面，也不应出现在 sitemap 中。

代码中已按语义区分：

- `published` 查询只返回已发布内容。
- `public` 查询用于站内展示，可包含 `coming_soon`。

### 课程内容

课程内容没有放数据库，而是放在独立仓库，用 MDX 管理。

- 每个 lesson 是一个 mdx 文件
- 通过 GitHub API 拉取内容
- 使用 Next.js cache（revalidate + tags）控制更新

这样可以避免每次改内容都触发完整构建，同时保留 Git 版本记录。

## 其他

### Analytics

由于项目挂在在主域名下的`/courses` 路径， 因此 Vercel Analytics / Speed Insights 的 endpoint 指向主域名 `https://www.raytonx.com` 下的 `/courses` 路径，以避免跨域问题。

如果后续调整域名或部署路径，请同步检查：

- `app/layout.tsx`
- `next.config.ts`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BASE_PATH`
