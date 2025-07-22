# 3OS - 标准化全生命周期生态平台

[![VitePress](https://img.shields.io/badge/docs-VitePress-646CFF.svg)](https://vitepress.dev/)

## 项目简介

3OS 是一个游戏 PaaS 平台，提供稳定、便捷的游戏运行环境。开发者可以在 3OS 上发布自己的游戏，接入商可以一键购买并部署开发者发布的游戏，直接向游戏玩家提供游戏服务。

### 核心特性

- **全生命周期云原生标准化** - 从设计到运维全流程标准化，减少99%重复性人工操作，杜绝环境差异导致的故障
- **开放API生态集成** - 提供RESTful/gRPC双协议接口文档及沙箱环境，开发者1小时完成服务对接
- **弹性成本模型** - 按游戏实例动态计费（CPU/内存/流量），采购方成本较传统方案降低60%
- **开发者-接入方协同网络** - 平台智能匹配游戏内容供给与接入需求，缩短交易链路，提升10倍供需匹配效率
- **分钟级游戏接入** - 标准化SDK支持H5游戏接入，一次开发接入，立享海量游戏内容
- **多方共赢分成体系** - 开发者获70%分成，接入方节省50%成本，销售/商务团队享阶梯佣金

## 文档结构

本项目使用 VitePress 构建技术文档，包含以下主要模块：

```text
📁 overview/           # 平台概览
├── overview.md         # 平台介绍
├── game-develop.md     # 游戏开发流程
└── game-integration.md # 游戏接入指南

📁 api/                # API 文档
├── developer_api/      # 开发者 API
│   ├── developer_api.md    # API 概览
│   ├── get_instance_config.md # 获取运行时配置
│   ├── get_instance_info.md   # 获取实例信息
│   ├── post_inform.md         # 发布通知
│   ├── Health.md              # 健康检查
│   ├── Inform.md              # PAAS通知
│   ├── Config.md              # 后台配置接口
│   └── Stat.md                # 获取游戏汇总数据
└── integrator_api/     # 接入商 API
    ├── client_api.md       # 客户端接入
    └── server_api/         # 服务端 API
        ├── get_score.md        # 获取积分
        ├── change_score.md     # 修改积分
        ├── get_sstoken.md      # 获取SSToken
        ├── update_sstoken.md   # 更新SSToken
        └── get_user_info.md    # 获取用户信息
```

## 快速开始

### 环境要求

- Node.js 16+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 本地开发

启动开发服务器：

```bash
pnpm run docs:dev
```

访问 `http://localhost:5173` 查看文档。

### 构建部署

构建生产版本：

```bash
pnpm run docs:build
```

预览构建结果：

```bash
pnpm run docs:preview
```

## 开发者接入

### 游戏开发流程

1. **准备游戏组件**
   - 游戏服务端（监听3333、3334端口）
   - 游戏后台（监听3335端口）
   - H5客户端（静态资源文件）

2. **实现必要接口**
   - 健康检查接口 (`:3334/callback/health`)
   - PAAS通知接口 (`:3334/callback/inform`)
   - 后台配置接口 (`:3335/callback/config`)
   - 统计数据接口 (`:3335/callback/stat`)

3. **客户端集成**
   - 实现加载进度通知
   - 配置WebView和JsBridge

### API文档

详细的API文档请参考：

- [开发者API文档](/api/developer_api/developer_api.md)
- [接入商API文档](/api/integrator_api/client_api.md)

## 接入商集成

### 客户端接入

支持以下平台的客户端接入：

- Android
- iOS
- Web

详细集成指南请参考 [客户端接入文档](/api/integrator_api/client_api.md)。

### 服务端API

提供完整的服务端API，包括：

- 用户管理
- 积分系统
- Token管理
- 数据统计

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 联系我们

- 官网: [https://www.3os.co](https://www.3os.co)
- 文档: [访问在线文档](https://docs.3os.co)

---

© 2025 3OS. All rights reserved.
