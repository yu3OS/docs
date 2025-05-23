# get_instance_info



## 描述

本接口为获取实例信息，包含游戏相关信息



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

| 参数        | 类型   | 说明     |
| ----------- | ------ | -------- |
| code        | Int32  | 返回码   |
| message     | String | 结果描述 |
| data        | Object | 配置信息 |
| └ game_id   | String | 游戏ID   |
| └ game_name | String | 游戏名   |



### 响应示例

```json
{
    "code": 0,
    "message": "worth till into regularly",
    "data": {
        "game_id": "",
        "game_name": ""
    }
}
```



### 返回码

| 返回码 | 说明             |
| ------ | ---------------- |
| 5000   | 实例不存在       |
| 5010   | 运行环境配置错误 |

