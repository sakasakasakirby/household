$(function() {

  $('.select__month, .select__year').on('change', function(e){
    let date = createYearMonth();
    let user_id = createUserID();
    
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
        addIncomeHTML(data[0].total_array);
        addUserInfoHTML(data[0].double_array, data[0].target);
      } else {
        addIncomeZero();
        addUserInfoZero();
      }
    })
    .fail(function(){
      alert('DBへの接続に失敗しました');
    })
  })

  //全項目の削除
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
  
  //今月の収支タブの項目を全て0円にする
  function addIncomeZero(){
    $('.contents__content__text6__money__context').remove();
    let html = '<div class="contents__content__text6__money__context plus">0円</div>';
    for(i = 3; i >= 0; i--){
      html += '<div class="contents__content__text6__money__context minus">0円</div>';
    }
    html += '<div class="contents__content__text6__money__context contents__content__text6__money__sum">0円</div>';
    $('.contents__content__text6__money').append(html);
  }

  //ユーザ情報の今月の収支を0円にする
  function addUserInfoZero(){
    $('.user-management__display__info__context__right__income').text("0円");
  }

});