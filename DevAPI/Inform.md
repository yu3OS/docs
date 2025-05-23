# Inform



## 描述

开发者需要实现该接口，此接口为PaaS平台主动调用，所有需要实例知道的通知信息



## 请求



### 请求参数

| 参数名      | 类型   | 是否必填 | 说明     |
| ----------- | ------ | -------- | -------- |
| app_id      | String | 是       | 应用ID   |
| instance_id | String | 是       | 实例ID   |
| type        | String | 是       | 通知类型 |
| data        | Object | 是       | 携带数据 |



### 请求示例

```
{
    "app_id": "xxxxxxxx",
    "instance_id": "2503191624bSur6F",
    "type": "resource_update",
    "data": {
        …
    }
}
```

**请求说明**

1. type 类型说明

   * "resource_update": 资源变更。收到资源变更，需要立即切换资源的连接。
   * "maintenance_schedule": 维护计划。包含服务更新（定时更新、立即更新），收到更新提示1分钟内，需要通知游戏内的用户进入维护状态，并停止游戏的结算。1分钟后，系统将重启服务。
   * "warning": 预警信息
   
2. data 数据说明

   * 资源变更时，包含变更内容，比如MySQL变更，包含变更后的MySQL资源信息：

     ```json
     {
       "mysql": {
         "host": "mechanic phooey",
         "port": 3306,
     
         "username": "pro unaware knowingly eyeglasses",
     
         "password": "whoever drat wherever kindheartedly fatherly",
     
         "database": "thorn"
     
       }
     }
     ```
   
     
   
   * <font color='red'>TODO data格式持续更新</font>
   
     
   

​	      

### 响应参数

| 参数       | 类型   | 说明     |
| ---------- | ------ | -------- |
| code       | Int32  | 返回码   |
| message    | String | 结果描述 |
| data       | Object | 配置信息 |
| └ response | String | 响应状态 |



### 响应示例

```json
{
    "code": 0,
    "message": "",
    "data": {
        "response": "ok"
    }
}
```

