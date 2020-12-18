$(function () {
    $(".comments_list").hide();
    let isLogin;
    $("#private").hide();
    $("#login").show();
    $.ajax({
        type: "get",
        url: "/login/status",
        dataType: "json",
        success: function (response) {
            isLogin = response.login;
        },
        error: function (){
            console.log("error");
        }
    });
    if(isLogin){
        $("#private").show();
        $("#login").hide();
    }

    if(isLogin){
        $(".comments_list").show();
    }
    
    $("#reply").submit(function (e) {
        e.preventDefault();
        $("#errCom").hide();
        $("#errCom").empty();
        if(isLogin){
            if($("wcomm").val().trim()){
                ("#reply").submit();
            }else{
                e.preventDefault();
                $("#errCom").text("Comments can't be empty");
                $("#errCom").show();
            }
        }else{
            $(location).attr('href', '/login');
        }
    });
});