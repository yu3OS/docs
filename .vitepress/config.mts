import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "3OS",
  description: "3OS - Standardized Full-Lifecycle Ecosystem Platform",
  base: "/3os-docs/",
  themeConfig: {
    footer: {
      message: "STM TECH PTE. LTD.",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "https://www.3os.co" },
      { text: "文档", link: "/overview/overview" },
    ],

    sidebar: [
      {
        text: "开始使用",
        items: [
          { text: "平台介绍", link: "/overview/overview" },
          { text: "游戏开发流程", link: "/overview/game-develop" },
          {
            text: "游戏接入流程",
            link: "/overview/game-integration",
          },
        ],
      },
      {
        text: "API 参考",
        items: [
          {
            text: "开发者 API",
            link: "/api/developer_api/developer_api",
            items: [
              {
                text: "交互 API",
                items: [
                  {
                    text: "获取运行时配置",
                    link: "/api/developer_api/get_instance_config",
                  },
                  {
                    text: "获取实例信息",
                    link: "/api/developer_api/get_instance_info",
                  },
                  { text: "发布通知", link: "/api/developer_api/post_inform" },
                ],
              },
              {
                text: "PAAS 回调 API",
                items: [
                  {
                    text: "健康检查",
                    link: "/api/developer_api/Health",
                  },
                  {
                    text: "PAAS 通知",
                    link: "/api/developer_api/Inform",
                  },
                  {
                    text: "后台配置接口",
                    link: "/api/developer_api/Config",
                  },
                  {
                    text: "获取游戏汇总数据",
                    link: "/api/developer_api/Stat",
                  },
                ],
              },
            ],
          },
          {
            text: "接入商 API",
            items: [
              { text: "客户端", link: "/api/integrator_api/client_api" },
              {
                text: "服务端",
                link: "/api/integrator_api/server_api/",
                items: [
                  {
                    text: "获取 Token",
                    link: "/api/integrator_api/server_api/get_sstoken",
                  },
                  {
                    text: "更新 Token",
                    link: "/api/integrator_api/server_api/update_sstoken",
                  },
                  {
                    text: "获取用户信息 ",
                    link: "/api/integrator_api/server_api/get_user_info",
                  },
                  {
                    text: "加减积分",
                    link: "/api/integrator_api/server_api/change_score",
                  },
                  {
                    text: "获取用户积分",
                    link: "/api/integrator_api/server_api/get_score",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/yu3OS/docs" }],
  },
});
