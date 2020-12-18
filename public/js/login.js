$(function () {
    $("#login").click(function (e) {
        e.preventDefault();
        $("#login_container").show();
        $("#regi_container").hide();
    });
    $("#signup").click(function (e) {
        e.preventDefault();
        $("#login_container").hide();
        $("#regi_container").show();
    });

    $("#login_name")
        .focusout(function (e) {
            e.preventDefault();
            if (chUser($("#login_name").val())) {
                $("#errname").show();
            } else {
                $("#errname").hide();
                $("#errname").empty();
            }
        });

    $("#login_pass")
        .focusout(function (e) {
            e.preventDefault();
            if (chPass($("#login_pass").val())) {
                $("#errpass").show();
            } else {
                $("#errpass").hide();
                $("#errpass").empty();
            }
        });

    $("#name")
        .focusout(function (e) {
            e.preventDefault();
            if (chUser($("#name").val())) {
                $("#errnameR").show();
            } else {
                $("#errnameR").hide();
                $("#errnameR").empty();
                $.ajax({
                    type: "get",
                    url: `/registration/checkname/${$("#name").val()}`,
                    dataType: "json",
                    success: function (response) {
                        if (response.used) {
                            $("#errnick").show();
                            $("#errnick").text("username has been used");
                        } else {
                            $("#errnick").hide();
                            $("#errnameR").empty();
                        }
                    }
                });

            }
        });

    $("#nickname")
        .focusout(function (e) {
            e.preventDefault();
            if (chNick($("#nickname").val())) {
                $("#errnick").show();
            } else {
                $("#errnick").hide();
                $("#errnameR").empty();
                $.ajax({
                    type: "get",
                    url: `/registration/checknick/${$("#nickname").val()}`,
                    dataType: "json",
                    success: function (response) {
                        if (response.used) {
                            $("#errnick").show();
                            $("#errnick").text("nickname has been used");
                        } else {
                            $("#errnick").hide();
                            $("#errnameR").empty();
                        }
                    }
                });
            }
        });

    $("#pass")
        .focusout(function (e) {
            e.preventDefault();
            if (chPass($("#pass").val())) {
                $("#errpassR").show();
            } else {
                $("#errpassR").hide();
                $("#errpassR").empty();
            }
        });

    $("#c_pass")
        .focusout(function (e) {
            e.preventDefault();
            if ($("#c_pass").val() !== $("#pass").val()) {
                $("#errpassC").show();
            } else {
                $("#errpassC").hide();
                $("#errpassC").empty();
            }
        });

    $("#gender")
        .focusout(function (e) {
            e.preventDefault();
            if (chGen($("#gender").val())) {
                $("#errgen").show();
            } else {
                $("#errgen").hide();
                $("#errgen").empty();
            }
        });

    $("#email")
        .focusout(function (e) {
            e.preventDefault();
            if (chEmail($("#email").val())) {
                $("#erremail").show();
            } else {
                $("#erremail").hide();
                $("#erremail").empty();
            }
        });
    $("login-form").submit(function (e) {
        e.preventDefault();
        $("err1").hide();
        let name = $("#login_name").val().trim();
        let pass = $("#login_pass").val().trim();
        if (name && pass) {
            if (chUser(name) && chPass(pass)) {
                $("login-form").submit();
                $("err1").hide();
            } else {
                $("err1").show();
            }
        } else {
            $("err1").show();
        }
    });
    $("regi-form").submit(function (e) {
        e.preventDefault();
        $("err2").hide();
        let name = $("#name").val().trim();
        let pass = $("#pass").val().trim();
        let nick = $("#nickname").val().trim();
        let c = $("#c_pass").val().trim();
        let gen = $("#gender").val().trim();
        let el = $("#email").val().trim();
        if (name && pass && nick && c && gen && el) {
            let flag = chUser(name) && chPass(pass) && chNick(nick) && chPass(c) && chGen(gen) && chEmail(el);
            if (flag) {
                $("regi-form").submit();
                $("err2").hide();
            } else {
                $("err2").show();
            }
        } else {
            $("err2").show();
        }
    });


    function chUser(user) {
        if (user.length > 0) return false;
        else return true;
    }

    function chPass(pass) {
        if (pass.length > 0) return false;
        else return true;
    }

    function chGen(gen) {
        if (gen !== 'male' && gen !== "female") return true;
        else return false;
    }

    function chEmail(email) {
        var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (email.length > 0 || pattern.test(email)) {
            return false;
        } else return true;
    }

    function chNick(nick) {
        if (nick.length > 5) {
            return false;
        } else return true;
    }
});