function Local(){}
Local.prototype.getData =function(){
    var data = localStorage.getItem("todolist")
    if(data!==null){
        return JSON.parse(data)
    }else{
        return []
    }
}
Local.prototype.saveData = function(data){
    console.log(data[data.length-1])
    localStorage.setItem("todolist",JSON.stringify(data))
}

var local = new Local();


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