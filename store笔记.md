### sotre 上有如下4个方法：
+ dispatch
  触发action默认只能同步修改,不能异步
+ getState
  方法无参数 直接调用返回state
+ replaceReducer
+ subscribe
  监听数据变化，触发dispatch就会触发subscribe