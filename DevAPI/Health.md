# Health



## 描述

该接口为开发者实现的接口，该接口为PaaS平台主动调用，检查实例状态



## 请求



### 响应参数

| 参数     | 类型   | 说明     |
| -------- | ------ | -------- |
| code     | Int32  | 返回码   |
| message  | String | 结果描述 |
| data     | Object | 配置信息 |
| └ status | String | 服务状态 |
| └ online | Int    | 在线人数 |



### 响应示例

```json
{
    "code": 0,
    "message": "",
    "data": {
        "status": "ok",
        "online": 100
    }
}
```

**响应参数说明**

1. status 返回当前游戏状态如:正常"ok",异常"error"等提供给平台作为判断

   游戏是否正常运行的依据和判断

2. online 返回当前游戏的在线人数

