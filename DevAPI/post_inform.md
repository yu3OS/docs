# post_inform



## 描述

本接口为实例向PaaS系统传递通知信息，如实例可更新通知等



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

| 参数    | 类型   | 说明     |
| ------- | ------ | -------- |
| code    | Int32  | 返回码   |
| message | String | 结果描述 |
| data    | Object | 配置信息 |
| └ type  | String | 类型     |
| └ data  | Object | 数据     |



### 响应示例

```json
{
    "code": 0,
    "message": "worth till into regularly",
    "data": {
        "type": "",
        "data": {}
    }
}
```

**参数说明**

1. type类型如下:
   * instance_status_started: 启动成功/失败通知
   * instance_status_can_maintance: 可维护通知
2. 启动成功/失败通知，在实例启动后发送；可维护通知，在维护流程中发送

### 返回码

| 返回码 | 说明             |
| ------ | ---------------- |
| 5000   | 实例不存在       |
| 5010   | 运行环境配置错误 |

