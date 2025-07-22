# get_user_info



## 描述

获取认证用户的详细信息



## 请求



### 请求头参数

| 参数        | 类型   | 是否必须 | 说明           |
| ----------- | ------ | -------- | -------------- |
| X-Signature | String | 是       | 签名           |
| X-Timestamp | String | 是       | 当前时间戳(秒) |
| X-Nonce     | String | 是       | 随机字符串     |
| X-AppID     | String | 是       | 应用ID         |



### 请求头示例

```
X-Signature : "814c7ecbffca7e1fe3fcadeae1da6a3b"
X-Timestamp : "1744083339"
X-Nonce : "xef87ea"
X-AppID: "yu32504091343UKAPes"
```



**注意** 此请求头参数由paas方提供，接入方可根据签名，时间戳，随机字符串和APPID进行校验，根据PAAS后台提供的secret_key进行识别和比对，校验签名 sign = md5(nonce+AppID+secret+timestamp) ,请妥善保管secret_key



### 请求参数

| 参数名      | 类型   | 是否必填 | 说明   |
| ----------- | ------ | -------- | ------ |
| user_id     | String | 是       | 用户ID |
| ss_token    | String | 是       | 授权码 |
| instance_id | String | 是       | 实例ID |



### 请求示例

```json
{
    "user_id": "1000009",
    "ss_token": "5cb2258d8801a7c0737d5b60d0e2fdf5",
  	"instance_id":"xxxxx"
}
```



### 响应参数

| 参数        | 类型   | 说明     |
| ----------- | ------ | -------- |
| code        | Int32  | 返回码   |
| message     | String | 结果描述 |
| data        | Object | 返回信息 |
| └  user_id  | String | 用户ID   |
| └ user_name | String | 用户昵称 |
| └ head_img  | String | 用户头像 |
| └ score     | Int64  | 用户积分 |



### 响应示例

```json
{
  "code": 0,
  "message": "",
  "data": {
    "user_id": "1000009",
    "user_name": "user_nickname",
    "head_img": "",
    "score": 1000000
  }
}
```

**返回值说明**

<font color='red'>用户信息请按照实际数据传递给游戏方，否则由接入方承担损失！</font>