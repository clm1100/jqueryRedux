
const [INIT_LIST] = ["INIT_LIST"];
var {createStore,combineReducers} = Redux;
function todolist(state=[],action){
    switch(action.type){
        case INIT_LIST:
            return [
                ...action.list
            ];
        default:
        return state;
    }
}

var reducers = combineReducers({todolist});
var store = createStore(reducers);
store.subscribe(function(){
    console.log(111)
    // 获取最新数据
    var newlist = store.getState().todolist;
    // 渲染到页面
    load(newList)
})
// 获取数据
var newList = local.getData();

// 更新sotre中的数据
store.dispatch({type:INIT_LIST,list:newList})


function load(list){
    var todocount = 0;
    var donecount=0;
    $("ul,ol").html("");
    $.each(list,function(i,n){
        if(n.done){
            donecount++
            $("ul").prepend("<li><input type='checkbox' checked='checked' > <p>"+n.title+"</p> <a href='javascript:;' id="+i+" ></a></li>")
        }else{
            todocount++
            $("ol").prepend("<li><input type='checkbox' > <p>"+n.title+"</p> <a href='javascript:;' id="+i+" ></a></li>")
        }
    });
    $("#todocount").text(todocount);
    $("#donecount").text(donecount);
}