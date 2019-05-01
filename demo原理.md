#### jquery 结合 redux制作 TODOlist

+ 本地数据变化 
+ 触发subscribe 
+ 获取远程数据,更新本地数据,重新渲染

#### 如果是远程数据的话,就非常简单了,不论是增删改,只需要将信息传递到后端服务器,后端服务器修改数据,然后前端根据返回结果重新,dispatch获取最新数据,更新数据即可;
#### 这里store的reducer只有一个操作,那就是获取最新数据
#### 伪代码形式为：
+  ajaxDele({id},(data)=>{1、异步最新数据；2、dispatch(最新数据)})
+  ajaxAdd({title,content},(data)=>{1、异步最新数据；2、dispatch(最新数据})
+  ajaxUpdata({id,title,content},(data)=>{1、异步最新数据；2、dispatch(最新数据})

#### 1、异步最新数据；2、dispatch(最新数据)可以抽离出来,封装成一个函数；
```
getDataAndRender(){
    1、异步最新数据；
    2、dispatch(最新数据)
}
```

#### 而main2.js中完成的功能都是修改本地数据
+ 获取本地数据将数据存储到store中,
+ 所有增删改查都可以通过store来监控,修改完store之后触发subscrible中监听的函数
+ 在函数内部获取最新的state,将其存储在本地并渲染