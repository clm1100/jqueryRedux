function Local(){}
Local.prototype.getData =function(){
    var data = localStorage.getItem("todolist")
    if(data!==null){
        return JSON.parse(data)
    }else{
        return []
    }
}
var local = new Local();