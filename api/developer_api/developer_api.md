# 开发者 API



## API概览



### 交互API

| 接口                                            | 说明           |
| ----------------------------------------------- | -------------- |
| [get_instance_config](/api/developer_api/get_instance_config.md) | 获取运行时配置 |
| [get_instance_info](/api/developer_api/get_instance_info.md)     | 获取实例信息   |
| [post_inform](/api/developer_api/post_inform.md)                 | 发布通知       |



### PAAS回调API

**（要求开发者实现以下端口的路由接口,以此来完成与PAAS的交互）**

| 接口                                 | 说明             |
| ------------------------------------ | ---------------- |
| [:3334/callback/health](/api/developer_api/Health.md) | 健康检查         |
| [:3334/callback/inform](/api/developer_api/Inform.md) | PAAS通知         |
| [:3335/callback/config](/api/developer_api/Config.md) | 后台配置接口     |
| [:3335/callback/stat](/api/developer_api/Stat.md)     | 获取游戏汇总数据 |

**注意**

+ health/inform 接口，在开发者提供的两个服务（游戏逻辑服务、游戏后台服务）中都要实现 
+ config/stat接口的data由开发者实现，并在游戏的说明页面中提供文档

### [更新动态](/api/developer_api/changelog.md)








