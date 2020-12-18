$(function () {
    $("#person_information").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").show();
        $("#changePass").hide();
        $("#changeInfo").hide();
        $("#his").hide();
        $("#fol").hide();
        $("#foled").hide();
        $("#contri").hide();
    });
    $("#password_change").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").hide();
        $("#changePass").show();
        $("#changeInfo").hide();
        $("#his").hide();
        $("#fol").hide();
        $("#foled").hide();
        $("#contri").hide();
    });
    $("#watch_history").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").hide();
        $("#changePass").hide();
        $("#changeInfo").hide();
        $("#his").show();
        $("#fol").hide();
        $("#foled").hide();
        $("#contri").hide();
    });
    $("#information_change").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").hide();
        $("#changePass").hide();
        $("#changeInfo").show();
        $("#his").hide();
        $("#fol").hide();
        $("#foled").hide();
        $("#contri").hide();
    });
    $("#follow").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").hide();
        $("#changePass").hide();
        $("#changeInfo").hide();
        $("#his").hide();
        $("#fol").show();
        $("#foled").hide();
        $("#contri").hide();
    });
    $("#followed").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").hide();
        $("#changePass2").hide();
        $("#changeInfo").hide();
        $("#his").hide();
        $("#fol").hide();
        $("#foled").show();
        $("#contri").hide();
    });
    $("#contribution").click(function (e) {
        e.preventDefault();
        $("err").hide();
        $("#info").hide();
        $("#changePass2").hide();
        $("#changeInfo").hide();
        $("#his").hide();
        $("#fol").hide();
        $("#foled").hide();
        $("#contri").show();
    });
    
    $("form1").submit(function (e) {
        $("err").hide();
        $("err").empty();
        let pass = $("#pass").val().trim();
        if(pass){
            if(chPass(pass)){
                $("err").hide();
            }else{
                e.preventDefault();
                $("err").text("Please provide valid password");
                $("err").show();
            }
        }else{
            e.preventDefault();
            $("err").text("Please provide valid password");
            $("err").show();
        } 
    });

    $("form2").submit(function (e) {
        $("err").hide();
        $("err").empty();
        let email = $("#email").val().trim();

        let nick = $("#nickname").val().trim();

        if(email && nick ){
            let flag = chNick(nick) && chEmail(el);
            if(flag){
                $("err").hide();
                $.ajax({
                    type: "get",
                    url: `/registration/check-nick/${nick}`,
                    dataType: "json",
                    success: function (response) {
                        if(response.used){
                            e.preventDefault();
                            $("#err").show();
                            $("#err").text("username has been used");
                            return true;
                        }else {
                            $("#err").hide();
                            $("#err").empty();
                        }
                    }
                });
            }else{
                e.preventDefault();
                $("err").show();
            }
        }else{
            e.preventDefault();
            $("err").show();
        }
    });

    function chPass(pass) {
        if(pass.length > 0)  return false;
        else return true;
    }

    function chEmail(email) {
        var pattern= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(pattern.test(email)){
            return false;
        }else return true;
    }

    function chNick(nick) {
        if (nick.length > 5){
            return false;
        }else return true;
    }
});