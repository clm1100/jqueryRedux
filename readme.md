#### redux上面只有5个方法
+ applyMiddleware
+ bindActionCreators
+ combineReducers
    + 合并reducer的,reducer需要开发者根据业务逻辑自己书写;
    + 调用方式为 
    ```combineReducers({ notes ,另外的reducer})```

+ compose
+ createStore
  创建store的,参数可是一个叫reducer的函数;
  - 1、这个函数可以自己直接创建 代码形式为
  - ### reducer 代码 一个reducer只维护一个数据的状态
  ```
    function notes(state = [ ], action){
    //每一次的操作无论是添加、删除还是初始化，全部的笔记内容会被重新更新一次
    switch(action.type){
        // case INIT_NOTES:
        //     return [ ...action.notes ];
        case ADD_NOTE:
            return [
                ...state,
                {
                    id: action.id,
                    title: action.title,
                    note: action.note
                }
            ];
        case DELETE_NOTE:
            var newState=[];
            state.map((note) =>{
                if(note.id != action.id){
                    newState.push(note);
                }
            });
            return newState;
        default:
            return state;
    }
}
  ```
  可以直接将reducer传递给createStore;
  也可以将混合reducer传递给createStore

### sotre 上有如下4个方法：
+ dispatch
+ getState
+ replaceReducer
+ subscribe



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



##### applyMiddleware源码
```
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    // 利用传入的createStore和reducer和创建一个store
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
      )
    }
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 让每个 middleware 带着 middlewareAPI 这个参数分别执行一遍
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 接着 compose 将 chain 中的所有匿名函数，组装成一个新的函数，即新的 dispatch
    dispatch = compose(...chain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}
```

####中间件原理
```
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```