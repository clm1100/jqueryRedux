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

