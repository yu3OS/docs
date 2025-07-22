# get_instance_config

## 描述

本接口为获取配置接口，实例在启动时，通过该接口获取实例配置信息，包括MySQL、Redis等资源，以及与业务服务交互的接口和秘钥等信息

## 请求

### 请求参数


| 参数名      | 类型   | 是否必填 | 说明       |
| ----------- | ------ | -------- | ---------- |
| instance_id | String | 是       | 游戏实例ID |

### 请求示例

```json
{
    "instance_id": "2503191624bSur6F"
}
```

### 响应参数


| 参数     | 类型   | 说明                       |
| -------- | ------ | -------------------------- |
| code     | Int32  | 返回码                     |
| message  | String | 结果描述                   |
| data     | Object | 配置信息                   |
| └ mysql | Object | 包含mysql的host/port等信息 |
| └ redis | Object | 包含redis的host/port等信息 |
| └ apis  | Object | 包含与游戏交互的接口地址   |

### 响应示例

```json
{
    "code": 0,
    "message": "worth till into regularly",
    "data": {
        "mysql": {
            "host": "mechanic phooey",
            "port": 3306,
            "username": "pro unaware knowingly eyeglasses",
            "password": "whoever drat wherever kindheartedly fatherly",
            "database": "thorn"
        },
        "redis": {
            "host": "or censor optimal awesome",
            "port": 6379,
            "username": "",
            "password": "around after anti",
            "database": 0
        },
        "apis": {
            "api_get_sstoken": "zowie daily",
            "api_update_sstoken": "next",
            "api_get_userinfo": "pace gray",
            "api_get_score": "fowl including er fearless quizzically",
            "api_change_score": "down"
        }
    }
}
```

**参数说明**

1. apis中为业务API地址，详细说明如下：


   | 变量名称           | 接入文档                                                  |
   | ------------------ | --------------------------------------------------------- |
   | api_get_sstoken    | [get_sstoken](/api/integrator_api/server_api/get_sstoken.md)       |
   | api_update_sstoken | [update_sstoken](/api/integrator_api/server_api/update_sstoken.md) |
   | api_get_userinfo   | [get_userinfo](/api/integrator_api/server_api/get_user_info.md)     |
   | api_get_score      | [get_score](/api/integrator_api/server_api/get_score.md)           |
   | api_change_score   | [change_score](/api/integrator_api/server_api/change_score.md)     |

### 返回码


| 返回码 | 说明             |
| ------ | ---------------- |
| 5000   | 实例不存在       |
| 5010   | 运行环境配置错误 |