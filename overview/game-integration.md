
# 游戏接入流程

## 接入流程图

![时序图](https://static.3os.co/uploads/2025/07/18/A8C8E86B/game_integration.png "时序图")

## 开发需要

### 客户端

游戏H5，与本地App通过调用App实现的js函数进行交互。

> TODO: 补充App交互函数的实现方法，或增加链接跳转说明页面

需要实现的函数：
1. game_load_complete 游戏加载完毕通知
2. game_destroy 关闭游戏
3. game_recharge 余额不足/点击充值

按上图工作流程，App在WebView中打开游戏H5链接，当游戏开始loading的时候，会收到通知（类型为"load_started"）：
```typescript
appJS.game_load_complete('load_started');
```
当游戏加载完毕，可以登录时，同样会收到通知（类型为"load_completed"）：
```typescript
appJS.game_load_complete('load_completed');
```

#### 参数传递

游戏H5接受两种传递参数的方法，一种是通过URL传参，另一种是通过JS方法"game_start"传参。
##### URL传参
这里还有另一种方式，即App.WebView打开游戏链接时，拼接游戏所需要的参数在链接中，如：
```typescript
app.WebView.OpenUrl('https://path_to_game_h5_url/game_client/v1.0/index.html?user_id=100001&code=xeihkfk88ekk1s&server_addr=d3NzOi8vM3Nkay5jb20vZ2FtZXNlcnZlcg%3D%3D&score_icon=aHR0cHM6Ly9wYXRoX3RvX2N1cnJlbmN5X2ljb24vaWNvbi5wbmc%3D&language=en-US&user_data=');
```
使用这种方式时，请注意：
1. 所有字符串参数需要先base64编码，再进行urlencode编码
2. 如果通过url传递了必要的参数（包含user_id、server_addr和code），游戏加载完毕后将自动进入登录流程，不再等待App调用 game_start 函数
3. **score_icon 和 language 两个参数总是使用URL传参的形式传递**
4. 推荐使用JS函数调用传参，能够更灵活的掌控游戏进程

##### JS调用传参
当收到游戏 load_completed 通知时，App可以调用游戏js方法 game_start 传递用户信息相关的必要参数，如：
```typescript
gameJS.game_start({
	user_id: '100001',
	code: 'xeihkfk88ekk1s',
	server_addr: 'wss://3sdk.com/gameserver',
	user_data: ''
});
```
则游戏即可继续用户登录进程。



### 服务端

PaaS通过调用App服务端实现的REST api与App服务交互。这里面包含涉及用户信息、积分等敏感数据，需要通过一定的验签方式进行签名校验，签名验证通过后，才可进行后续操作。

App方需要实现的接口：

1. get_sstoken 用户认证
2. update_sstoken 更新签名
3. get_user_info 获取用户信息
4. get_score 获取用户积分
5. change_score 加/减积分

计算签名需要的app_id和secret来自于PaaS后台配置。将实现好的接口，对应配置到PaaS后台，即可实现游戏接入。

#### 关于验签

1. 签名获取方法：
		X-Signature、X-Timestamp、X-AppID、X-Nonce信息通过请求头获得
2. 签名计算方法：
		X-Signature = md5(X-Nonce + X-AppID + X-AppSecret + X-Timestamp);
3. AppID、AppSecret在后台生成/获取；
4. 签名md5使用小写；
5. X-Nonce在1分钟内不可重复使用；
6. X-Timestamp前后误差不可超过60秒；
7. 验签失败应拒绝请求，返回403；

## 高级用法

### user_data

user_data 是自定义参数，游戏内会将user_data从客户端，透传到服务端，便于App实现其需要的高级功能：
1. 客户端传递参数给游戏，可对user_data进行参数设计，比如user_data='1000'用于代表该用户打开游戏所在的直播间ID为1000
2. user_data会通过游戏协议，传递到PaaS，PaaS在调用用户认证接口get_sstoken时，将其传递给App服务端，再由App服务端根据这个参数，进行逻辑判断
3. get_sstoken认证完成后，可根据逻辑返回另外一个user_data，这个user_data会在游戏调用change_score时传递回App服务端，做其他逻辑判断使用
4. 通过灵活使用user_data可实现App与游戏的深度融合，实现复杂的逻辑判断
5. 如果不希望user_data被伪造，可使用加密算法