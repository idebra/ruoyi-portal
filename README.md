# ruoyi-portal 若依门户

RuoYi-Vue 的业务前台（门户）：简单介绍页 + 与若依后台共用的注册/登录 + 匿名（游客）浏览。
账户与数据全部来自若依后端，本服务不自建用户体系。

## 结构

- Vue 3 + Vite 单页应用，无 UI 库，手写样式
- 页面：`/` 首页（介绍/功能/技术栈）、`/login` 登录、`/register` 注册、`/me` 我的（登录后从后台 `/getInfo` 取真实账号信息；游客为匿名视图）
- 接口：浏览器 → 本服务 nginx 的 `/prod-api/` → 反代 `app:8080`（与后台前端同一通道）

## 前置条件

- 若依后端开启注册：参数设置 `sys.account.registerUser = true`（关着时注册接口返回「当前系统没有开启注册功能」）
- Docker 部署时与 RuoYi-Vue 同处一个 Compose 网络，能以服务名 `app` 访问后端

## 本地开发

```bash
npm install
npm run dev   # 5173 端口，/prod-api 代理到本机 8080
```

## Docker 部署（docker-stack 中）

服务定义见主仓库的 docker-stack `docker-compose.yml`（服务名 `portal`，本机端口 8091），构建：

```bash
docker compose build portal && docker compose up -d portal
```
