$(function () {
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
});