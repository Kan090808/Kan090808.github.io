$(document).ready(function () {
  // 初始化
  $("#main").load("intro.html");

  $(".sidenav a").click(function () {
    var id = $(this).attr("id");
    var str = id + ".html";
    // alert(str);
    $(".sidenav a").removeClass("active");
    $(this).addClass("active");
    $("#main").load(str);
  })
});