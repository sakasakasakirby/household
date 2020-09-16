$(document).ready( function(){

  let url = location.href;
  if(url.slice(url.length-1, url.length) === "/" || url.slice(url.length-1, url.length) === "#"){
    
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;

    addSelectBox(year);

    $('.select__year').val(year);
    $('.select__month').val(month);
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
      for(i = 0; i < data.length ; i++){
        addHTML(data[i]);
      }
      if(data.length > 0){
        addIncome(data[0].total_array);
        addTotal(data[0].double_array);
        addUserInfoHTML(data[0].double_array, data[0].target);
      }
    })
    .fail(function(){
      alert('DBへの接続に失敗しました');
    })

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

    html = '<div class="contents__content__text' + data.item_id + '__money__context">' + data.money + '円</div>';
    html += '<div class="contents__content__text' + data.item_id + '__money__context contents__content__text' + data.item_id + '__money__sum">' + data.total + '円</div>';
    $('.contents__content__text' + data.item_id + '__money').append(html);
  }

  function addIncome(array){
    $('.contents__content__text6__money__context').remove();
    let html = '<div class="contents__content__text6__money__context plus">' + array[4] + '円</div>';
    let income = array[4];
    for(i = array.length-2; i >= 0; i--){
      html += '<div class="contents__content__text6__money__context minus">' + array[i] + '円</div>';
      income -= array[i];
    }
    html += '<div class="contents__content__text6__money__context contents__content__text6__money__sum">' + income + '円</div>';
    $('.contents__content__text6__money').append(html);
  }

  function addTotal(array){
    $('.contents__content__text7__info__context').remove();
    let html = "";
    for(i = 0; i < array[0].length; i++){
      html += '<div class="contents__content__text7__info__context">' + array[0][i] + 'の収支</div>';
    }
    html += '<div class="contents__content__text7__info__context contents__content__text7__info__sum">total</div>';
    $('.contents__content__text7__info').append(html);
    $('.contents__content__text7__money__context').remove();
    let total_money = 0;
    html = "";
    for(i = 0; i < array[1].length; i++){
      html += '<div class="contents__content__text7__money__context">' + array[1][i] + '円</div>';
      total_money += array[1][i]
    }
    html += '<div class="contents__content__text7__money__context contents__content__text7__money__sum">' + total_money + '円</div>';
    $('.contents__content__text7__money').append(html);
  }

  function addSelectBox(year){
    for(i = 0; i < 10; i++){
      y = year - i;
      dis = y + "年"
      $('#select_year').append($('<option>').html(dis).val(y));
    }
  }

  function addUserInfoHTML(double_array, target){
    let m = $('.select__month').val();
    let date = "";
    if(m.length == 1){
      date = $('.select__year').val() + "-0" + m;
    } else {
      date = $('.select__year').val() + "-" + m;
    }
    let income = 0;
    let total = 0;
    for(i = 0; i < double_array[0].length; i++){
      if(double_array[0][i] === date){
        income = double_array[1][i];
      }
      total += double_array[1][i];
    }
    remaining = target - total;
    //画像変更
    if(remaining <= 0){
      let html = '<div class="user-management__display__info__object__image__message">目標達成！</div>'
      html += '<img class="image" src="/assets/happy_woman.png"></img>';
      $('.user-management__display__info__object__image__message').remove();
      $('.image').remove();
      $('.user-management__display__info__object__image').append(html);
    } else if(remaining <= target/10){
      let html = '<div class="user-management__display__info__object__image__message">もう少し！</div>'
      html += '<img class="image" src="/assets/shock_woman.png"></img>';
      $('.user-management__display__info__object__image__message').remove();
      $('.image').remove();
      $('.user-management__display__info__object__image').append(html);
    } else {
      let html = '<div class="user-management__display__info__object__image__message">まだまだじゃん…</div>'
      html += '<img class="image" src="/assets/shock_woman.png"></img>';
      $('.user-management__display__info__object__image__message').remove();
      $('.image').remove();
      $('.user-management__display__info__object__image').append(html);
    }
    $('.user-management__display__info__context__right__income').text(income + "円");
    $('.user-management__display__info__context__right__total').text(total + "円");
    $('.user-management__display__info__context__right__target').text(target + "円");
    $('.user-management__display__info__context__right__remaining').text(remaining + "円");
  }

});