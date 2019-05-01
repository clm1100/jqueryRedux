#### redux上面只有5个方法
+ applyMiddleware
  - 使用中间件有关的方法：
  - 源码为：
  ```
  待补充
  ```
  - 参数为``` ...[a,b,c] ``` 
    + 1、参数个数不确定，为不定参
    + 2、参数形式为函数
    + 3、函数形式为中间件格式，格式是固定的。实例代码如下：
    ```
      暂时没有待补充
    ```
  - 其返回值为一个函数,这个函数需要传递一个特殊的参数,createStore
    + 1、这个返回的函数是干什么的？
      答：保存中间件数组，返回一个函数这个函数优化createStore
    + 2、为什么需要一个参数？
      答： 这个参数为createStore，执行完成后对其优化
    + 3、传入参数调用之后的结果是什么呢？
      答：调用完成后，返回一个新的createStore,内部接受reducer,并处理store的dispatch
  - 调用形式为：
   ```let createStoreWithMiddleware = applyMiddleware(...funcs)(createStore) ```
  > ***返回值：是一个全新的createStore的方法，不过这个方法创建的store在触发dispatch的时候会触发中间件***
+ bindActionCreators ？？？？
+ combineReducers
    + 合并reducer的,reducer需要开发者根据业务逻辑自己书写;
    + 调用方式为 
    ```combineReducers({ notes ,另外的reducer})```
    + 需要注意的是，函数名即方位相应state的属性名
+ compose
  参数为一个数组，数组每一项为一个函数，函数是纯函数;
  合并多个函数
  - funcs.reduce((a,b)=>(arg)=>a(b(arg)))
  - 或者
  - funcs.reduce((a, b) => (...args) => a(b(...args)))
+ createStore 
  + 创建store的方法
  + 有两个参数,第一个参数为 **reducer**
  + 第二个参数为 初始化的数据,默认的state
  ### reducer的形式
  - 1、这个函数可以自己直接创建 代码形式为
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
  ### reducer代码：一个reducer最好只维护一个数据的状态，用法注意：
    + 可以直接将reducer直接传递给createStore,这样的话store只能保存一个数据;
    + 也可以将混合reducer传递给combineReducers，combineReducers可以将多个reducer混合成一个reducer,而reducer的函数名就是获取相应state的属性.

#### applyMiddleware源码
> 注意：
+ 1、这个函数可以连续调用三次
+ 2、第一次传入参数为不定参，数组每一项为中间件函数
+ 3、第二次传入参数为createStore,目的是返回一个全新的createStore
+ 4、第三次传入的参数为reducer,但是一般不这么使用
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

#### 中间件原理版本变化过程
+ 第一个版本 手动记录
```
let action = addTodo('Use Redux')
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
```

+ 第二个版本 *封装dispatch*
** 要发起action的时候，不用 dispatch 而是用 disptchAddLog()。（把这个方法放在store里面、好像还不错的样子）**
```
function dispatchAndLog(store, action) {
  console.log('dispatching', action)
  store.dispatch(action)
  console.log('next state', store.getState())
}
```

+ 第三个版本,(猴子补丁):
***　通过重写store.dispatch(), （重写之后，所使用的dispatch(), 已经不是原生的dispatch了，使用多个中间件，就是不断改写前一次生成的dispatch），（注意：原生的dispatch，已经不可能找到，也就是不能单独使用原始dispatch了）　***
```
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```

+ 第四个版本,封装猴子补丁,将其放到一个函数中,这个函数的作用就是扩展store的dispatch的方法。用这个方法处理过store后其dispatch方法进行了重写


```
function logger(store) {
    let next = store.dispatch
    store.dispatch = function dispatchAndLog(action) {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result
    }
}
```

+ 第五个版本,隐藏猴子补丁,也是将其放入函数中,但是不直接修改,而是直接返回一个函数.
> 乍一看好像和猴子补丁没什么却别，但其实它把赋值的给store.dispatch的逻辑放到了中间件函数的外面，需要外面提过一个applyMiddleware辅助函数来完成插值，除此之外，真的没什么区别。（原理还是猴子补丁）
```
function logger(store) {
  let next = store.dispatch
  // store.dispatch = function dispatchAndLog(action) {
  return function dispatchAndLog(action) {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
  }
}
```
> 多个中间件 的实现方式**applyMiddlewareByMonkeypatching**模拟**applyMiddleware**源码
```
function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  // 在每一个 middleware 中变换 dispatch 方法。
  middlewares.forEach(middleware =>
    store.dispatch = middleware(store)
  )
}

```
> 函数执行解释：将中间件顺序倒置,每个中间件对store进行处理,类似上面的logger方法。
> 再看一下logger:
```
function logger(store) {
  let next = store.dispatch
  return function dispatchAndLog(action) {
    let result = next(action)
    return result
  }
}
```
> 代码很精简,函数调用产生一个闭包,保存当前store的dispatch,然后返回一个新函数
> 新函数的作用也是dispatch,***完成了对闭包中dispatch的包装***：
173行的middleware的执行,每执行一次就更新一下store的dispatch,最终store上的dispatch调用的话,所有中间件都会执行。

+ 第六个版本,移除猴子补丁了,这一步不是很明白，这里我们把applymiddlewile的代码放在这里再看一下：
```
function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
      )
    }
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}
```
> 相对隐藏猴子不同，隐藏在middleware函数里面 let next = store.dispatch,放到函数外面 
>dispatch = middleware(store)(dispatch) 
      + 1、仔细观察206行,先将所有的中间件执行一次,每次执行传入一个被处理过的store
      ```
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args)    
      }                             
      ```
      + 2、得到一个数组，数组中的每一项是这样的：
      ```
        function wrapDispatchToAddLogging(next) {
          return function dispatchAndLog(action) {
            console.log('dispatching', action)
            let result = next(action)
            console.log('next state', store.getState())
            return result
          }
        }
      ```
     #### 注意这是一个修改dispatch的函数,传入dispatch会返回一个新的dispatch
     模拟代码如下：
     function add100(next){
       return function(x){
         return next(x)
       }
     }

```
  function logger(store) {
    return function wrapDispatchToAddLogging(next) {
      return function dispatchAndLog(action) {
        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result
      }
    }
  }
```
用es6来实现的话就是这样的：(终极模式)
```
let logger=(store)=>(next)=>(action)=>{
  <!-- 执行中间件逻辑 -->
  return next(action)
}
```
<!-- 这里面有个疑问,？？？？？，将问题描述清晰 -->
**是否发现：在 return 的 assign 之前， store.dispatch 都是原生的，并没有被改变。所以中间件里面是否可以使用store.dispatch调用原生的，（如果有需要的话）,然而笔者试着调用了一下，并不行，会不断的触发，就是已经是该改变之后的了。**

> 然后再看一下applyMiddleware的源码:
```
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()

  let dispatch = store.dispatch
  middlewares.forEach(middleware =>
    dispatch = middleware(store)(dispatch)
  )

  return Object.assign({}, store, { dispatch })
}
```
