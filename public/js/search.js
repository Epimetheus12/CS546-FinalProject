$(function () {
    $("#searchForm").submit(function (e) { 
        $("err").hide();
        if($("#searchText").val().trim()) {
            return true;
        }else {
            e.preventDefault();
            $("#err").show();
        }
    });
});