$(document).ready(function () {
  // 初始化
  $(".sidenav a").removeClass("active");
  if (localStorage.getItem("page")) {
    $("#" + localStorage.getItem("page")).addClass("active");
    $("#main").load(localStorage.getItem("page") + ".html");
  } else {
    $("#intro").addClass("active");
    $("#main").load("intro.html");
  }
  $(".sidenav a").click(function () {
    var id = $(this).attr("id");
    var str = id + ".html";
    // alert(str);
    localStorage.setItem("page", id);
    $(".sidenav a").removeClass("active");
    $(this).addClass("active");
    $("#main").load(str);
  })
});