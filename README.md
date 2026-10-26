# 智能任务管理系统

一个简洁美观的任务管理系统，支持任务添加、优先级设置、状态切换、筛选和删除。

## 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **后端**: NestJS 10 + Drizzle ORM
- **数据库**: Supabase PostgreSQL

## 功能

- 输入框 + 优先级下拉（高/中/低），点击添加任务
- 任务列表：标题、优先级标签、完成状态
- 每条任务：完成/未完成切换 + 删除按钮
- 按优先级筛选：全部 / 高 / 中 / 低
- 任务按创建时间倒序，已完成任务标题加删除线

## 环境变量

在 Supabase 项目中获取以下配置，并设置为环境变量：

| 变量名 | 说明 |
|--------|------|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_ANON_KEY` | Supabase anon / publishable key |

## 数据库建表

在 Supabase Dashboard 的 SQL Editor 中执行以下建表语句：

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  priority varchar(20) not null default 'medium',
  is_completed boolean not null default false,
  _created_at timestamptz(3) not null default current_timestamp,
  _updated_at timestamptz(3) not null default current_timestamp
);

create index idx_tasks_priority on tasks(priority);
create index idx_tasks_created_at on tasks(_created_at);
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 构建与部署

### 全量构建（前端 + 后端）

```bash
npm run build
```

产物输出到 `dist/` 目录，启动方式：

```bash
cd dist
node server/main.js
```

### Vercel 部署（前端静态）

项目根目录已包含 `vercel.json`，可直接导入 Vercel 部署前端静态资源。

> 注意：Vercel 上仅部署前端静态页面，后端 API 需单独部署到支持 Node.js 的平台（如 Railway、Render、Fly.io 等）。前端 API 请求地址需相应调整。
