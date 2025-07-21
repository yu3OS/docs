# 接入商客户端接入

<img src="https://static.3os.co/uploads/2025/07/18/EEFF23B4/uml.jpeg" alt="uml" style="zoom: 67%;" />

## 客户端快速接入

### Android 接入

1. 初始化WebView和JsBridge

   ```kotlin
   //声明WebSettings子类
   val webSettings = mBinding.webView.settings
   
     //如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
     webSettings.javaScriptEnabled = true
     webSettings.domStorageEnabled = true
   
   
     // 若加载的 html 里有JS 在执行动画等操作，会造成资源浪费（CPU、电量）
     // 在 onStop 和 onResume 里分别把 setJavaScriptEnabled() 给设置成 false 和 true 即可
   
     //设置自适应屏幕，两者合用
     webSettings.useWideViewPort = true //将图片调整到适合webview的大小
     webSettings.loadWithOverviewMode = true // 缩放至屏幕的大小
   
   
     //缩放操作
     webSettings.setSupportZoom(true) //支持缩放，默认为true。是下面那个的前提。
     webSettings.builtInZoomControls = true //设置内置的缩放控件。若为false，则该WebView不可缩放
     webSettings.displayZoomControls = false //隐藏原生的缩放控件
   
   
     //设置优先级缓存
     webSettings.cacheMode = WebSettings.LOAD_DEFAULT
     webSettings.allowFileAccess = true //设置可以访问文件
     webSettings.javaScriptCanOpenWindowsAutomatically = true //支持通过JS打开新窗口
     webSettings.loadsImagesAutomatically = true //支持自动加载图片
     webSettings.defaultTextEncodingName = "utf-8" //设置编码格式
     webSettings.databaseEnabled = true
   
     webSettings.setSupportZoom(true)
     webSettings.useWideViewPort = true
     webSettings.allowUniversalAccessFromFileURLs = true
     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
       webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
     }
   //设置JsBridge
   mBinding.webView.addJavascriptInterface(JavaJSInterface(this), "App")
   ```

   

2. 注册申明Js交互方法

   ```kotlin
   
   val GAME_START = "game_start"
   val GAME_UPDATE_BALANCE = "game_update_balance"
   val LOAD_START_STATUS = "load_started"
   val LOAD_COMPLETED = "load_completed"
   
   @JavascriptInterface
   fun game_load_progress(progress:String){
     //游戏同步加载进度
   }
   
   @JavascriptInterface
   fun game_load_complete(type:String){
     //游戏加载完成
     if(type == LOAD_START_STATUS){
       //游戏开始状态
     }else if(type == LOAD_COMPLETED){
       //游戏加载完成
     }
   }
   
   
   @JavascriptInterface
   fun game_destroy(){
     //游戏关闭
   }
   
   @JavascriptInterface
   fun game_recharge(type:Int){
     //游戏余额不足通知
   }
   
   @JavascriptInterface
   fun game_update_balance(){
     //游戏金币更新通知
   }
   
   fun callJs(str: String) {
      webView.post { webView.loadUrl("javascript:$str") }
   }
   
   
   fun gameStart(params:String){
   	CallJs("$GAME_START($params)")
   }
   
   fun gameUpdateBalance(params:String){
     CallJs("$GAME_UPDATE_BALANCE($params)")
   }
   
   
   ```
   
   **游戏方法说明**
   
   1. game_load_progress：游戏加载进度显示
   
   2. game_load_complete：游戏开始加载和资源加载完毕状态，通过此方法通知App，方便其选择合适时机显示webview以及调用**game_start**方法继续游戏流程
   
   3. game_destroy：游戏内点击关闭，通过此方法通知App关闭游戏webview
   
   4. game_recharge: 游戏内用户点击充值或积分不足时跳转充值，则调用此JS方法
   
   5. game_update_balance:  属于游戏js的方法,客户充值成功后通知游戏更新用户积分，需要客户端主动调用并且传递如下参数:
   
      | 参数名 | 类型   | 是否必须 | 说明     |
      | ------ | ------ | -------- | -------- |
      | score  | Number | 是       | 最新积分 |

      可采用以下例子进行实现：

      ```kotlin
      val json = "{score: 10000}";
      gameUpdateBalance(json)
      ```
   
      
   
   6. game_start: 属于游戏js的方法，需要客户端主动调用实现并且传递如下参数来验证并且连接到游戏：
   
      | 参数名      | 类型   | 是否必须 | 说明                      |
      | ----------- | ------ | -------- | ------------------------- |
      | user_id     | String | 是       | 用户唯一ID                |
      | code        | String | 是       | 接入者提供的认证码        |
      | server_addr | String | 是       | 游戏socket链接地址        |
      | score_icon  | String | 否       | 积分对应图标url(如金币等) |
      | language    | String | 否       | 语言代码（ISO 639-1）     |
      | user_data   | String | 否       | 自定义数据                |
   
      可采用以下例子进行实现
   
      ```kotlin
      val json = "{user_id: '100001'," +
      "code: 'xeihkfk88ekk1s'," +
      "server_addr: 'wss://3sdk.com/gameserver'," +
      "score_icon: 'https://path_to_currency_icon/icon.png'," +
      "language: 'en-US'," +
      "user_data: ''}"
      
      gameStart(json)
      ```
   
      **以上如server_addr,score_icon等需要传入地址的参数需要先base64编码，再进行urlencode编码**
   
      **user_data可以根据接入方需求或者特殊游戏需要进行传参，如接入方需要获取用户在某个直播间的游玩记录可以传递如："roomId=10000"这样的参数记录来统计**
   
      



​		

​			

​	


