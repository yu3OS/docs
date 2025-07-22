# 游戏开发流程

## 概述

目前游戏PaaS平台只支持H5客户端。开发者按PaaS要求，提供**游戏服务端、游戏后台、H5客户端**。审核通过后，即可接入PaaS平台。
游戏服务端、游戏后台，仅需提供编译好的二进制文件及完整的服务启动命令。H5客户端，提供打包好的静态资源文件。


::: warning
注意：
1. 游戏服务暂不提供PHP等脚本语言运行环境，暂时仅支持通过二进制直接启动的运行方式。
2. 游戏服务运行所使用的数据库、缓存，目前只支持MySQL和Redis。
3. 本文档中的源码均为做逻辑说明的伪代码，供参考。
:::



## 概念

PaaS：指3os开放平台
游戏服务端： 游戏逻辑服务
游戏客户端： 游戏客户端（目前为H5）
游戏后台： 提供给接入方使用的游戏管理后台
游戏实例： 游戏服务发布以后可以无限分发给多个接入方，每次启动作为一个实例，通过实例ID区分

## 工作流程图

游戏开发者需要了解的完整流程图：
![时序图](https://static.3os.co/uploads/2025/07/18/269EF8E5/game_develop.png "时序图")
其中，游戏服务端需监听3333(客户端连接端口)，及3334(PaaS调度端口)。游戏后台服务是一个独立服务，监听3335端口。游戏客户端是发布好的客户端H5文件。

## 开发说明

### 客户端

#### 开发指引

1.加载进度
游戏加载页面，通过 game_load_complete 通知App：
```typescript
//开始加载，进入loading 页，标志着游戏已经跳过 splash 画面进入到游戏画面
//App 根据这个通知显示 WebView
app.game_load_complete('load_started');
//加载进度同步
app.game_load_progress(30.0);
//加载完成，进入主界面
app.game_load_complete('load_completed');
```
> App与H5交互函数的实现方法可以参考 [这里](/api/integrator_api/client_api.md)

2.解析URL参数
```typescript
//本文所列代码均以cocos creator环境typescript语言（客户端）、Golang（服务端）为例，仅供参考。下同。

//解析url参数
parseURLParams() {
	let url:string = window.location.href;
	var queryStart = url.indexOf("?") + 1,
		queryEnd = url.indexOf("#") + 1 || url.length + 1,
		query = url.slice(queryStart, queryEnd - 1),
		pairs = query.replace(/\+/g, " ").split("&"),
		params = {}, i, n, v, nv;
	if (query === url || query === "") return;
	for (i = 0; i < pairs.length; i++) {
		nv = pairs[i].split("=", 2);
		n = decodeURIComponent(nv[0]);
		v = decodeURIComponent(nv[1]);
		if (!params.hasOwnProperty(n)) params[n] = [];
		params[n].push(nv.length === 2 ? v : null);
	}
	return params;
}

//解析参数
let param:any = self.parseURLParams();
console.log(param);

//读取参数
if (param && param['user_id']) {
	userId = param['user_id'][0];
}
```
客户端启动时，通过 parseURLParams 函数解析 App 传递给 H5 的 URL 参数。

**参数说明：**

| 参数名            | 类型     | 解析途径     | 使用说明         |
| -------------- | ------ | -------- | ------------ |
| user_id        | string | URL或交互函数 | 用户唯一ID       |
| code           | string | URL或交互函数 | 接入者提供的认证码    |
| server_addr    | string | URL或交互函数 | 游戏socket连接地址 |
| user_data      | string | URL或交互函数 | 自定义数据（高级用法）  |
| score_icon     | string | URL      | 积分图标图片URL    |
| score_icon_ext | string | URL      | 积分图标的图片后缀名   |
| language       | string | URL      | 语言代码         |

**几个重点说明：**
- score_icon : 需要在游戏主页面显示前，将游戏内所有积分图标进行替换（如金币、积分等）。建议将积分图标做成prefab预制体，可以一次处理全部替换。
- score_icon_ext : 当score_icon的URL不以.png/.jpg等结尾时，需要传递图片的后缀名。否则忽略该参数。（举例：score_icon_ext=png）
- language : 如果游戏客户端支持多语言，需要根据传入的语言代码切换显示语言。语言代码参考标准 [ISO 639-1](https://zh.wikipedia.org/wiki/ISO_639-1)。（举例：language=en）
- URL参数解析，要对所有字符串参数先进行urldecode解码，再base64解码。

3.判断URL传参有效性

情况一：当URL参数中解析到了 user_id 、 code 、 server_addr 三个参数且有效时（都不为空），代表 App 希望通过URL传参的形式，实现用户登录认证功能。此时，游戏加载完毕后直接使用这些参数进入登录流程。

情况二：反之，如果这三个参数没有通过 URL 解析得到，或解析到无效参数，则需要在游戏加载完成后，发送 load_completed 通知给App游戏加载完成并等待 App 调用 game_start 传递了对应参数再继续登录认证。

这两种方式，伪代码演示过程如下：
```typescript
//cocos creator start
start() {
	if (user_id != '' && code != '' && server_addr != '') {
		//情况一：直接连接服务器，开始登录流程
		socket.connect(server_addr, 'arraybuffer', 'login');
	} else {
		//情况二：通知 App 加载完成，等待 game_start 调用
		app.game_load_complete('load_completed');
	}
}

//收到 App 调用 game_start
on_app_called_game_start(data:any) {
	if (user_id == '' || code == '') {
		server_addr = data.server_addr;
		user_id = data.user_id;
		code = data.code;
		user_data = data.user_data;
		//情况二：收到 game_start 调用，才连接服务器，进行登录流程
		socket.connect(server_addr, 'arraybuffer', 'login');
	}
}

//socket连接成功后，发送登录协议
on_socket_open() {
	socket.send_login(user_id, code, user_data);
}
```
游戏内通过协议与服务端认证成功后，即游戏内的交互逻辑。

4.其他交互

- game_update_balance 更新游戏内积分余额
```typescript
on_app_called_game_update_balance(user_id:number) {
	//通过游戏协议，查询用户最新积分余额
	socket.send_get_balance(user_id);
}

on_msg_get_balance(o:any, data:any) {
	//更新UI上的余额显示
}
```
#### 打包发布

以cocos creator为例，开发者仅需提供打包好的、包含index.html文件的完整文件夹即可。

#### 布局支持

H5游戏客户端，需要支持两种布局，且根据WebView的分辨率比例自动切换。当宽高比(宽/高) <= 0.56 时（或高宽比(高/宽) >= 1.8）时，使用全屏铺满布局。否则，应自动切换至半屏布局。
以下以cocos creator为例，给出一种实现方法：
```typescript
//loading过程中判断高宽比
let screenSize = screen.windowSize;
let aspectRatio = screenSize.height/screenSize.width;
let sceneName = 'scene-half'; //默认半屏 如果高宽比>=1.8 则使用全屏布局
if (aspectRatio >= 1.8) {
	sceneName = 'scene-full'; //提供两种布局场景文件 scene-half(半屏) 和 scene-full(全屏) 即可
}
assetManager.main.loadScene(sceneName, self.onProgress.bind(self), self.onCompleted.bind(self));
```

### 服务端

#### 游戏启动

PaaS在启动游戏服务时，会通过命令行参数的形式将必要参数传递给开发者，这些参数包括：
```go
var api_paas_config string //PaaS提供的获取运行环境配置的接口地址
var instance_id string //当前启动的实例ID
```
以golang为例，在服务启动时解析这些参数：
```go
flag.StringVar(&apiConfig, "api_paas_config", "https://xx", "-api_paas_config https://xx") //api_paas_config 获取游戏运行时配置的API接口
flag.StringVar(&instanceId, "instance_id", "", "-instance_id 1234567890") //instance_id 游戏实例ID
```
拿到这两个参数以后，通过 api_paas_config 和 instance_id 向PaaS获取运行时配置：
```go
//请求参数
type InstanceConfigRequest struct {
	InstanceID string `json:"instance_id"`
}

//构造请求参数
req := InstanceConfigRequest{
	InstanceID: instanceId,
}

//请求运行时参数
r, _ := json.Marshal(req)
http.Post("api_paas_config", string(req))

//以下为调用成功后的返回结果

//获得运行时参数类似如下
"mysql": {
	"host": "127.0.0.1",
	"port": 3306,
	"username": "root",
	"password": "123456",
	"database": "gamex"
},
"redis": {
	"host": "127.0.0.1",
	"port": 6379,
	"username": "",
	"password": "123456",
	"database": 0
},
"apis": {
	"api_post_inform": "https://...", //向PaaS发布通知消息接口
	"api_get_sstoken": "https://...", //用户认证接口
	"api_update_sstoken": "https://...", //更新sstoken接口
	"api_get_userinfo": "https://...", //获取用户信息接口
	"api_get_score": "https://...", //获取用户积分接口
	"api_change_score": "https://..." //加减积分接口
}
...
```
拿到这些游戏实例的运行时配置，即可连接对应的资源服务。并在游戏中使用交互API进行后续步骤的交互。
> 注意：PaaS要求，游戏socket服务应总是监听3333端口（游戏逻辑服务），并同时监听3334端口（处理PaaS的Web回调）。

#### 用户认证

当收到客户端登录请求，并得到客户端传递的必要参数后(通过socket协议)，服务端通过 [get_sstoken](/api/integrator_api/server_api/get_sstoken.md) 接口做用户认证：
```go
//构造请求参数
req := SSTokenRequest{
	UserID: userId,
	Code: code,
	InstanceID: instanceID,
	UserData: userData,
}

//请求认证
r, _ := json.Marshal(req)
http.Post("https://...", string(r)) //api_get_sstoken

//获得认证结果
{
	"ss_token": "5cb2258d8801a7c0737d5b60d0e2fdf5",
	"expire_at": 1744169754,
	"user_data": ""
}
...
```
用户认证完成后，该用户即可在游戏中进行其他操作，后续操作都需要传递这一步获取到的 sstoken。

> 注意：所有与接入方进行交互的接口调用，全部应该在服务端完成，并且用户 sstoken 严禁返回给客户端

#### 刷新sstoken

在一定的有效期内（一般为3天），可以通过 [update_sstoken](/api/integrator_api/server_api/update_sstoken.md) 接口刷新sstoken，获得更长的有效期。

#### 获取用户信息

通过 [get_user_info](/api/integrator_api/server_api/get_user_info.md) 接口，可以通过用户ID获取用户信息。

#### 获取用户积分

通过 [get_score](/api/integrator_api/server_api/get_score.md) 接口，可以通过用户ID获取用户积分。

#### 用户加减分

通过 [change_score](/api/integrator_api/server_api/change_score.md) 接口，可以对用户进行加减积分操作。

> 注意：游戏逻辑，应该对加减积分的成功与否负责。比如，某一回合游戏中，扣分成功，却在结算阶段由于某种异常导致未给胜利的用户结算成功(加分)，则需要游戏维护一个结算失败的重试机制，保证用户最终结算成功。

#### 回调接口

游戏服务端需要通过3334端口实现两个PaaS的回调接口：
1. :3334/callback/health 健康检查接口 （[接口说明](/api/developer_api/Health.md)）
2. :3334/callback/inform 通知接口 （[接口说明](/api/developer_api/Inform.md)）

### 游戏后台

#### 后台页面

游戏后台需要提供一个配置游戏和查询游戏数据的可视化web页面。比如 :3335/ 打开游戏后台。
除可视化配置游戏以外，建议提供一个游戏的数据查询、汇总页面，提供给接入方通过用户ID查询游戏数据，以及汇总游戏数据。方便接入方在遇到游戏数据问题时，自行通过后台页面排查。

#### 配置接口

游戏后台提供的可视化配置、查询游戏数据功能，对应的提供API接口，以方便接入方将后台功能集成到其业务后台中。
1. :3335/callback/config 配置接口 （[接口说明](/api/developer_api/Config.md)）
2. :3335/callback/stat 数据查询接口 （[接口说明](/api/developer_api/Stat.md)）
> 注意：PaaS要求游戏后台服务须总是监听在3335端口。
#### 回调接口

同样的，游戏后台服务也需要通过3335端口实现两个PaaS的回调接口：
1. :3335/callback/health 健康检查接口 （[接口说明](/api/developer_api/Health.md)）
2. :3335/callback/inform 通知接口 （[接口说明](/api/developer_api/Inform.md)）
> 注意：PaaS要求游戏后台服务须总是监听在3335端口。

### 服务打包

游戏服务和后台服务，均以一个独立的文件夹发布，其中需包含服务程序的二进制文件。包括配置文件、日志文件、静态文件等所有文件，都应在当前目录下（可以是子目录或更深的目录，但不能在此目录之外）。
### 服务更新

发布一个游戏包含两个服务程序，游戏服务端和游戏后台。
当游戏服务端有新的版本更新时，为保障用户数据安全，避免未结算情况的发生，PaaS将在游戏服务端明确告知，可以进行维护操作时，进行版本升级及服务重启维护。

当接入方通过PaaS后台操作更新/维护计划，PaaS将通过inform接口（:3334/callback/inform）通知游戏实例，类型为 maintenance_schedule：
```go
http.Post('https://abc:3334/callback/inform', {
	...
	"type": "maintenance_schedule",
	"data": {
		"schedule_id": "xxxx",
	    "timestamp_start": "1744779943",
	    "timestamp_end": "1744779943",
	    "note": "版本升级"
	}
	...
})
```
具体参考inform接口说明。

收到该回调通知以后，游戏需要在开始维护时间后，在游戏结算完成时，将游戏置为维护状态（即不可再继续游戏，并通知客户端），通过 post_inform 接口向PaaS发送可维护更新的通知：
```go
http.Post('https://abc/post_inform', {
	"instance_id": "xxxx",
	"type": "instance_status_can_maintain",
	"data": {
		"schedule_id": "xxxx",
	}
	...
})
```
PaaS在收到该通知后，即开始更新维护，并重启服务。

> 游戏后台的更新，因为不影响用户数据，可以直接更新。接入方在PaaS选择升级操作时，会提示是否需要中断服务。

### 断线重连

当遇到游戏服务端维护重启、网络断线重连等情况时，为了更好的用户体验，需要游戏客户端实现断线重连机制。由于正常的游戏认证流程是服务端通过get_sstoken接口完成认证，但重连时该接口需要的code可能已经过期或失效，会出现认证失败的情况。

此处给出一种较为简单的实现方案，兼顾安全性，供开发者参考：
1. 当用户正常进入游戏时，游戏服务端在 get_sstoken 认证通过后，将用户的 sstoken 保存到 redis，并对当前键值设置一个有效期(如3天)，而key则设置成一个包含临时 tmpcode 的键名(如：game:dice:'userId':'tmpcode')，值为对应用户ID的有效 sstoken(如：b6ce7608283bca277a4c8a211c13ac95)。临时 tmpcode 尽量保证唯一(如：md5(timestamp+userId+sstoken+secret_string), secret_string 可以认为是只有自己知道的秘钥)
2. 将该临时 tmpcode 返回给客户端
3. 当游戏断线重连时，使用临时 tmpcode 校验，服务端判断为重连认证，获取到临时 tmpcode ，通过 redis 去获取对应用户的 sstoken
4. 获取到用户sstoken后，通过 update_sstoken 接口去尝试刷新 sstoken，若刷新成功，则表示认证成功，否则提示 token 过期认证失效，需要用户退出游戏重新进入走正常认证流程
5. 更新 redis 的用户 sstoken 为最新，并返回临时 tmpcode 给客户端（循环循环）

这种方法，保证 sstoken 不泄漏给客户端，仅返回一个无意义的 tmpcode，尽可能的保证了token安全，且在有限时间内(如 sstoken 有效期内)能够实现断线重连，无需用户退出游戏再重新进入。