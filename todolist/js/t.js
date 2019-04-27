$(function(){
    load();
    $("#title").on("keydown",function(e){
        if(e.keyCode==13){
            if($.trim($(this).val())==""){
                alert("请输入内容");
                return 

            }
            var local = getData();
            var obj = {
                title:$(this).val(),
                done:false
            }
            local.push(obj);
            // console.log(local);
            saveData(local);
            load();
            $(this).val("")
        }
    });

    $("ol,ul").on("click","a",function(){
        var id = $(this).attr("id");
        console.log(id);
        var data = getData();
        data.splice(id,1);
        saveData(data);
        load()
        // $(this).parents("li").remove();
    });

    $("ol,ul").on("click","input",function(){
        var data = getData();
        var index = $(this).siblings("a").attr("id");
        data[index].done = $(this).prop("checked");
        saveData(data);
        load();
    })

    function getData(){
        var data = localStorage.getItem("todolist");
        if(data !==null){
            return JSON.parse(data)
        }else{
            return []
        }
    }
    function saveData(data){
        localStorage.setItem("todolist",JSON.stringify(data));
    }
    // 原版load
    // function load(){
    //     var data = getData();
    //     $("ol").html("");
    //     $.each(data,function(i,n){
    //         $("ol").prepend("<li><input type='checkbox' > <p>"+n.title+"</p> <a href='javascript:;' id="+i+" ></a></li>")
    //     });


    // }
    // 更新load
    function load(){
        var todocount = 0;
        var donecount=0;
        var data = getData();
        $("ul,ol").html("");
        $.each(data,function(i,n){
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
})