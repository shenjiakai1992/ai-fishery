# 渔夫阿凯的AI仓库 — ai-fishery

AI 学习分享网站，基于 Next.js 14 + PostgreSQL + Prisma + Tailwind CSS 全栈实现。

> 技术选型详见 `开发/技术选型.md`（v3，中台变更通知 1-11 全部生效）。

## 技术栈

| 维度 | 选型 |
|------|------|
| 框架 | Next.js 14 App Router + Route Handlers |
| 语言 | TypeScript strict |
| 数据库 | PostgreSQL + Prisma 6 |
| 样式 | Tailwind CSS + shadcn/ui |
| HTML 解析 | cheerio（解析/回写 `<meta name="note:*">`） |
| 认证 | JWT + HttpOnly Cookie + 手机号验证码 |
| 文件存储 | 本地 public/uploads（开发）/ 阿里云 OSS（生产） |
| 短信 | 阿里云短信 dysmsapi |
| 部署 | 阿里云 ECS + Nginx + PM2 |

## 快速开始

### 1. 前置条件

- Node.js ≥ 18.17
- pnpm ≥ 9
- PostgreSQL（本地安装 / Docker / 云数据库）

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，至少填写：

- `DATABASE_URL` — PostgreSQL 连接串
- `JWT_SECRET` — 任意长随机字符串
- `ADMIN_WHITELIST_PHONES` — 可登录后台的手机号（逗号分隔）

> **本地无 PostgreSQL？** 推荐用 [Supabase](https://supabase.com) 或 [Neon](https://neon.tech) 免费层，复制连接串填入 `DATABASE_URL` 即可。

### 4. 初始化数据库

```bash
pnpm db:migrate    # 创建表结构
pnpm db:seed       # 播种初始数据（8 分类 / 25 标签 / 站点配置 / 关于页 / 管理员账号）
```

### 5. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 常用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint 检查 |
| `pnpm format` | Prettier 格式化 |
| `pnpm test` | 运行单元测试（Vitest） |
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:migrate` | 执行数据库迁移（开发） |
| `pnpm db:migrate:deploy` | 执行数据库迁移（生产） |
| `pnpm db:seed` | 播种种子数据 |
| `pnpm db:studio` | 打开 Prisma Studio 数据库可视化 |

## 目录结构

```
ai-fishery/
├── app/                      # Next.js App Router
│   ├── (public)/             # 前台路由组（首页/笔记/Skill/服务/关于）
│   ├── login/                # 登录页
│   ├── admin/                # 后台（Middleware 鉴权）
│   └── api/                  # Route Handlers（后端 API）
├── components/               # React 组件
│   ├── ui/                   # shadcn/ui 组件
│   └── custom/               # 业务组件
├── lib/                      # 工具库
│   ├── prisma.ts             # Prisma Client 单例
│   ├── auth/                 # JWT / Session / ACL
│   ├── sms.ts                # 阿里云短信
│   ├── storage/              # 文件存储（本地/OSS）
│   ├── html.ts               # cheerio 解析/回写
│   └── analytics/            # 埋点
├── prisma/
│   ├── schema.prisma         # 数据模型（15 张表）
│   ├── seed.ts               # 种子数据
│   └── migrations/           # 迁移文件
├── public/uploads/           # 本地开发文件存储
├── deploy/                   # 部署配置（Nginx / PM2 / deploy.sh）
├── tests/                    # 测试
└── .github/workflows/ci.yml  # CI
```

## 数据库模型（15 张表）

| 表 | 说明 |
|----|------|
| User / VerificationCode | 用户 + 验证码 |
| Category / Tag | 主题分类（8 类）+ 标签（≤30） |
| NoteTag / SkillTag / ServiceTag | 三类内容-标签中间表 |
| Note | 笔记（HTML 路径 + 元信息 + 状态） |
| Skill | Skill 推荐 |
| Service | AI 服务 |
| SiteConfig | 站点级 + 页面级配置 |
| TimelineEntry / ContactCard | 关于页内容 |
| AnalyticsEvent / AnalyticsEventTag | 埋点事件 |
| AuditLog | 审计日志 |

## 部署

详见 `deploy/` 目录。生产部署流程：

```bash
# 服务器上
git pull
pnpm install --frozen-lockfile
pnpm db:migrate:deploy
pnpm db:seed
pnpm build
pm2 reload ai-fishery
```

或直接执行 `deploy/deploy.sh`。

## 变更记录

2026/09/08：创建：T2 项目初始化，仓库骨架 + 依赖 + 配置 + Prisma schema（15 表）+ seed + 部署脚本
