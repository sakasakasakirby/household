$(function() {

  //チェックされた項目を取得
  function getChecked(num){
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check__box"]:checked').each(function() {
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

  //削除ボタンが押された際のフォームの作成
  function createButtonHTML(num){
    let html = '<div class="contents__content__add' + num + '__form">';
    html += '<form>';
    html += '<input type="submit" class="contents__content__add' + num + '__form__delete-y" value="決定">';
    html += '<input type="submit" class="contents__content__add' + num + '__form__delete-n" value="中止">';
    html += '</form>';
    html += '</div>';
    return html;
  }

  //削除したい項目を選択するためのチェックボックスの作成
  function createCheckBoxHTML(num){
    count = $('.contents__content__text' + num + '__money__context').length - 1;
    let html = '<div class="contents__content__text' + num + '__check">';
    for(i = 0; i < count; i++){
      html += '<input type="checkbox" id="box' + i + '" class="contents__content__text' + num + '__check__box" value="' + i + '">';
    }
    html += '</div>';
    return html;
  }

  //DBから削除された要素をブラウザ上からも削除
  function deleteHTML(num) {
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check__box"]:checked').each(function() {
      check_array.push($(this).val());
    })
    for(i = 0; i < check_array.length; i++){
      n = Number(check_array[i]) - i;
      $('.contents__content__text' + num + '__date__context').eq(n).remove();
      $('.contents__content__text' + num + '__info__context').eq(n).remove();
      $('.contents__content__text' + num + '__money__context').eq(n).remove();
    }
  }

  //削除した項目があるタブのtotalを更新
  function addTabTotalHTML(data){
    let id = data.item_id;
    let total = data.total.toLocaleString() + "円";
    $('.contents__content__text' + id + '__money__sum').text(total);
  }

  //ボタン押下時の処理
  function deleteProcess(num){
    $('.contents__content__add' + num + '__button').remove();
    $('.contents__content__add' + num + '__delete').remove();
    let html = createButtonHTML(num);
    $('.contents__content__add' + num).append(html);
    html = createCheckBoxHTML(num);
    $('.contents__content__text' + num).prepend(html);
  }

  //フォームの削除
  function interruptProcess(num){
    $('.contents__content__add' + num + '__form').remove();
    $('.contents__content__text' + num + '__check').remove();
    let html = returnHTML(num);
    $('.contents__content__add' + num).append(html);
  }

  //決定
  function decisionProcess(num){
    array = getChecked(num);
    let url = "/books/" + $(".user").attr("class").slice(9);
    
    $.ajax({
      url: url,
      type: 'DELETE',
      data: {array: array, item_id: num},
      dataType: 'json'
    })
    .done(function(data){
      deleteHTML(num);
      interruptProcess(num);
      addTabTotalHTML(data);
      changeIncomeHTML(data);
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
    interruptProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__delete-n', function(e){
    e.preventDefault();
    interruptProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__delete-n', function(e){
    e.preventDefault();
    interruptProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__delete-n', function(e){
    e.preventDefault();
    interruptProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__delete-n', function(e){
    e.preventDefault();
    interruptProcess(5);
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