$(function() {

  //チェックされた項目を取得
  function getCheckedContext(num, button){
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check-' + button + '__box"]:checked').each(function() {
      check_array.push($(this).val());
    })
    delete_array = []
    for(i = 0; i < check_array.length; i++){
      delete_num = Number(check_array[i]);
      array = []
      if(num <= 2){
        array.push(createDisplayYearMonthDay(num, delete_num));
      } else {
        array.push(createYearMonth());
      }
      array.push($('.contents__content__text' + num + '__info__context').eq(delete_num).text());
      let money = $('.contents__content__text' + num + '__money__context').eq(delete_num).text();
      array.push(Number(money.slice(0, money.length-1).split(',').join('')));
      delete_array.push(array);
    }
    return delete_array;
  }

  //DBから削除された要素をブラウザ上からも削除
  function deleteHTML(num, button) {
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check-' + button + '__box"]:checked').each(function() {
      check_array.push($(this).val());
    })
    for(i = 0; i < check_array.length; i++){
      n = Number(check_array[i]) - i;
      $('.contents__content__text' + num + '__date__context').eq(n).remove();
      $('.contents__content__text' + num + '__info__context').eq(n).remove();
      $('.contents__content__text' + num + '__money__context').eq(n).remove();
    }
  }

  //ボタン押下時の処理
  function deleteProcess(num){
    deleteButtonHTML(num);
    let html = createButtonHTML(num, "delete");
    $('.contents__content__add' + num).append(html);
    html = createCheckBoxHTML(num, "delete");
    $('.contents__content__text' + num).prepend(html);
  }

  //決定
  function decisionProcess(num){
    array = getCheckedContext(num, "delete");
    let url = "/books/" + $(".user").attr("class").slice(9);
    
    $.ajax({
      url: url,
      type: 'DELETE',
      data: {array: array, item_id: num},
      dataType: 'json'
    })
    .done(function(data){
      deleteHTML(num, "delete");
      interruptProcessUpdateDelete(num, "delete");
      addTabTotalHTML(data.total, data.item_id);
      changeIncomeHTML(data.total, data.item_id);
      addTotalHTML(data.total_array);
      addUserInfoHTML(data.total_array, data.target);
    })
    .fail(function(){
      alert('削除に失敗しました');
    })
  }

  //削除ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__delete', function(e){
    e.preventDefault();
    deleteProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__delete', function(e){
    e.preventDefault();
    deleteProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__delete', function(e){
    e.preventDefault();
    deleteProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__delete', function(e){
    e.preventDefault();
    deleteProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__delete', function(e){
    e.preventDefault();
    deleteProcess(5);
  })

  //中止ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__form__delete-n', function(e){
    e.preventDefault();
    interruptProcessUpdateDelete(1, "delete");
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__delete-n', function(e){
    e.preventDefault();
    interruptProcessUpdateDelete(2, "delete");
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__delete-n', function(e){
    e.preventDefault();
    interruptProcessUpdateDelete(3, "delete");
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__delete-n', function(e){
    e.preventDefault();
    interruptProcessUpdateDelete(4, "delete");
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__delete-n', function(e){
    e.preventDefault();
    interruptProcessUpdateDelete(5, "delete");
  })

  //決定ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__form__delete-y', function(e){
    e.preventDefault();
    decisionProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__delete-y', function(e){
    e.preventDefault();
    decisionProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__delete-y', function(e){
    e.preventDefault();
    decisionProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__delete-y', function(e){
    e.preventDefault();
    decisionProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__delete-y', function(e){
    e.preventDefault();
    decisionProcess(5);
  })

});