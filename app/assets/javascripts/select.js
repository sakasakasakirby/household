$(function() {

  $('.select__month, .select__year').on('change', function(e){
    month = "" + $('.select__month').val();
    if(month.length == 1){
      month = "0" + month;
    }
    let date = $('.select__year').val() + "-" + month;
    let c = $(".user").attr("class");
    let user_id = c.slice(9);
    $.ajax({
      url: '/api/books',
      type: 'GET',
      data: {date: date, user_id: user_id},  
      dataType: 'json'
    })
    .done(function(data){
      removeHTML();
      for(i = 0; i < data.length ; i++){
        addHTML(data[i]);
      }
      if(data.length > 0){
        addIncome(data[0].total_array);
        addUserInfoHTML(data[0].double_array);
      }else {
        addIncomeZero();
        addUserInfoZero();
      }
    })
    .fail(function(){
      alert('DBへの接続に失敗しました');
    })
  })

  function removeHTML(){
    let html;
    for(i = 1; i <= 5; i++){
      $('.contents__content__text' + i + '__date__context').remove();
      $('.contents__content__text' + i + '__info__context').remove();
      $('.contents__content__text' + i + '__money__context').remove();
      html = '<div class="contents__content__text' + i + '__date__context contents__content__text' + i + '__date__sum"></div>';
      $('.contents__content__text' + i + '__date').append(html);
      html = '<div class="contents__content__text' + i + '__info__context contents__content__text' + i + '__info__sum">total</div>';
      $('.contents__content__text' + i + '__info').append(html);
      html = '<div class="contents__content__text' + i + '__money__context contents__content__text' + i + '__money__sum">0円</div>';
      $('.contents__content__text' + i + '__money').append(html);
    }
  }

  function addHTML(data){
    $('.contents__content__text' + data.item_id + '__date__sum').remove();
    $('.contents__content__text' + data.item_id + '__info__sum').remove();
    $('.contents__content__text' + data.item_id + '__money__sum').remove();
    let month = data.date.slice(5, 7);
    let day = data.date.slice(8, 10);
    if(month[0] == 0){
      month = month.slice(1, 2);
    }
    if(day[0] == 0){
      day = day.slice(1, 2);
    }
    let date = month + "/" + day;
    if(data.item_id == 1 || data.item_id == 2){
      let html = '<div class="contents__content__text' + data.item_id + '__date__context">' + date + '</div>';
      html += '<div class="contents__content__text' + data.item_id + '__date__context contents__content__text' + data.item_id + '__date__sum"></div>';
      $('.contents__content__text' + data.item_id + '__date').append(html);
    }
    html = '<div class="contents__content__text' + data.item_id + '__info__context">' + data.name + '</div>';
    html += '<div class="contents__content__text' + data.item_id + '__info__context contents__content__text' + data.item_id + '__info__sum">total</div>';
    $('.contents__content__text' + data.item_id + '__info').append(html);
    html = '<div class="contents__content__text' + data.item_id + '__money__context">' + data.money.toLocaleString() + '円</div>';
    html += '<div class="contents__content__text' + data.item_id + '__money__context contents__content__text' + data.item_id + '__money__sum">' + data.total.toLocaleString() + '円</div>';
    $('.contents__content__text' + data.item_id + '__money').append(html);
  }

  function addIncome(array){
    $('.contents__content__text6__money__context').remove();
    let html = '<div class="contents__content__text6__money__context plus">' + array[4].toLocaleString() + '円</div>';
    let income = array[4];
    for(i = array.length-2; i >= 0; i--){
      html += '<div class="contents__content__text6__money__context minus">' + array[i].toLocaleString() + '円</div>';
      income -= array[i];
    }
    html += '<div class="contents__content__text6__money__context contents__content__text6__money__sum">' + income.toLocaleString() + '円</div>';
    $('.contents__content__text6__money').append(html);
  }
  
  function addIncomeZero(){
    $('.contents__content__text6__money__context').remove();
    let html = '<div class="contents__content__text6__money__context plus">0円</div>';
    for(i = 3; i >= 0; i--){
      html += '<div class="contents__content__text6__money__context minus">0円</div>';
    }
    html += '<div class="contents__content__text6__money__context contents__content__text6__money__sum">0円</div>';
    $('.contents__content__text6__money').append(html);
  }

  function addUserInfoHTML(double_array){
    let m = $('.select__month').val();
    let date = "";
    if(m.length == 1){
      date = $('.select__year').val() + "-0" + m;
    } else {
      date = $('.select__year').val() + "-" + m;
    }
    let income = 0;
    for(i = 0; i < double_array[0].length; i++){
      if(double_array[0][i] === date){
        income = double_array[1][i];
      }
    }
    $('.user-management__display__info__context__right__income').text(income.toLocaleString() + "円");
  }

  function addUserInfoZero(){
    $('.user-management__display__info__context__right__income').text("0円");
  }

});