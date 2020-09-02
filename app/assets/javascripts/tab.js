$(function()  {

  let tabs = $(".container__menu__item");
  function tabSwitch() {
    $(".active__last-item").removeClass("active__last-item");
    $(".income").css('background-color','#F3FFD8');
    $(".month").css('background-color','#E6FFE9');
    $(".total").css('background-color','#FFEEFF');
    $(".active").removeClass("active");
    if($(this).context.className.indexOf("income") > -1){
      $(this).css('background-color','#FFFF55');
    }else if($(this).context.className.indexOf("month") > -1){
      $(this).css('background-color','#2DFF57');
    }else if($(this).context.className.indexOf("total") > -1){
      $(this).css('background-color','#FF77FF');
    }
    if($(this).context.className.indexOf("last-item") > -1){
      $(this).addClass("active__last-item active");
    } else {
      $(this).addClass("active");
    }
    const index = tabs.index(this);
    $(".contents__content").removeClass("show").eq(index).addClass("show");
  }
  tabs.click(tabSwitch);

});

