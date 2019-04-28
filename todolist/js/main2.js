
const [INIT_LIST,ADD_LIST] = ["INIT_LIST","ADD_LIST"];
var {createStore,combineReducers} = Redux;
function todolist(state=[],action){
    switch(action.type){
        case INIT_LIST:
            return [
                ...action.list
            ];
        case ADD_LIST:
            return [
                ...state,
                {
                    title:action.title,
                    done:false
                }
            ]
        default:
        return state;
    }
}

var reducers = combineReducers({todolist});
var store = createStore(reducers);
store.subscribe(function(){
    // 获取最新数据
    local.saveData(store.getState().todolist);
    load(store.getState().todolist)
})
// 获取数据
var newList = local.getData();

// 更新sotre中的数据
store.dispatch({type:INIT_LIST,list:newList})

$("#title").on("keydown",function(e){
    if(e.keyCode==13){
        console.log(222)
        if($.trim($(this).val())==""){
            alert("请输入内容");
            return 
        }
        store.dispatch({type:ADD_LIST,title:$(this).val()})
    }
});


$("ol,ul").on("click","a",function(){
    var id = $(this).attr("id");
    console.log(id)

});

$("ol,ul").on("click","input",function(){
    var index = $(this).siblings("a").attr("id");
    // 异步远程更新数据后,再发送dispatch
    // dispatch 作用重新获取数据,更新数据,根据虚拟dom更新数据
    store.dispatch({
        type:DONE_LIST,
        val:$(this).prop("checked")
    })
})


