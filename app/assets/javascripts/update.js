$(function() {

  //チェックされたレコードをフォームにする
  function createTextFormChecked(num, checked_num){
    let context = $('.contents__content__text' + num + '__info__context').eq(checked_num).text();
    let money = $('.contents__content__text' + num + '__money__context').eq(checked_num).text().split(',').join('');
    money = money.slice(0, money.length-1);
    let html = '<input type="text" name="' + context + '" id="context' + checked_num + '" value="' + context + '" size="20" maxlength="20">';
    $('.contents__content__text' + num + '__info__context').eq(checked_num).html(html);
    html = '<input type="text" name="' + money + '" id="money' + checked_num + '" value="' + money + '" size="7" maxlength="10">円';
    $('.contents__content__text' + num + '__money__context').eq(checked_num).html(html);
  }

  //チェックを外されたレコードを元に戻す
  function undoTextFormChecked(num, checked_num){
    let context = $('#context' + checked_num).attr('name');
    let money = Number($('#money' + checked_num).attr('name')).toLocaleString();
    $('.contents__content__text' + num + '__info__context').eq(checked_num).html(context);
    $('.contents__content__text' + num + '__money__context').eq(checked_num).html(money + "円");
  }

  //チェックされている番号が格納された配列
  function getCheckedUpdate(num, button){
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check-' + button + '__box"]:checked').each(function() {
      check_array.push($(this).val());
    })
    return check_array;
  }

  //チェックされた項目を取得
  function getCheckedContextUpdate(num, button){
    let check_array = getCheckedUpdate(num, button);
    update_array = []
    for(i = 0; i < check_array.length; i++){
      update_num = Number(check_array[i]);
      after_array = [];
      before_array = [];
      if(num <= 2){
        after_array.push(createDisplayYearMonthDay(num, update_num));
        before_array.push(createDisplayYearMonthDay(num, update_num));
      } else {
        after_array.push(createYearMonth());
        before_array.push(createYearMonth());
      }
      after_array.push($('#context' + update_num).val());
      after_array.push(Number($('#money' + update_num).val()));
      before_array.push($('#context' + update_num).attr('name'));
      before_array.push($('#money' + update_num).attr('name'));
      array = [before_array, after_array];
      update_array.push(array);
    }
    return update_array;
  }

  //更新されたレコードを更新後の値に変更
  function updateHTML(num, checked_num, array){
    let context = array[1];
    let money = Number(array[2]).toLocaleString();
    $('.contents__content__text' + num + '__info__context').eq(checked_num).html(context);
    $('.contents__content__text' + num + '__money__context').eq(checked_num).html(money + "円");
  }
  
  //ボタン押下時の処理
  function updateProcess(num){
    deleteButtonHTML(num);
    let html = createButtonHTML(num, "update");
    $('.contents__content__add' + num).append(html);
    html = createCheckBoxHTML(num, "update");
    $('.contents__content__text' + num).prepend(html);
  }

  //決定
  function decisionProcess(num){
    let array = getCheckedContextUpdate(num, "update");
    let url = "/books/" + $(".user").attr("class").slice(9); 
    
    $.ajax({
      url: url,
      type: 'PUT',
      data: {array: array, item_id: num},
      dataType: 'json'
    })
    .done(function(data){
      checked_array = getCheckedUpdate(num, "update");
      for(i = 0; i < checked_array.length; i++){
        updateHTML(num, checked_array[i], data.update_array[i]);
      }
      interruptProcessUpdateDelete(num, "update")
      addTabTotalHTML(data.total, num);
      changeIncomeHTML(data.total, num);
      addTotalHTML(data.total_array);
      addUserInfoHTML(data.total_array, data.target);
    })
    .fail(function(){
      alert('値の更新に失敗しました');
    })
  }

  //更新ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__update', function(e){
    e.preventDefault();
    updateProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__update', function(e){
    e.preventDefault();
    updateProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__update', function(e){
    e.preventDefault();
    updateProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__update', function(e){
    e.preventDefault();
    updateProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__update', function(e){
    e.preventDefault();
    updateProcess(5);
  })

  //チェックボックスにチェックされた際の処理
  $('.contents__content__text1').on('click', '.contents__content__text1__check-update__box', function(e){
    if($(this).prop('checked')){
      createTextFormChecked(1, $(this).val());
    } else {
      undoTextFormChecked(1, $(this).val());
    }
  })
  $('.contents__content__text2').on('click', '.contents__content__text2__check-update__box', function(e){
    if($(this).prop('checked')){
      createTextFormChecked(2, $(this).val());
    } else {
      undoTextFormChecked(2, $(this).val());
    }
  })
  $('.contents__content__text3').on('click', '.contents__content__text3__check-update__box', function(e){
    if($(this).prop('checked')){
      createTextFormChecked(3, $(this).val());
    } else {
      undoTextFormChecked(3, $(this).val());
    }
  })
  $('.contents__content__text4').on('click', '.contents__content__text4__check-update__box', function(e){
    if($(this).prop('checked')){
      createTextFormChecked(4, $(this).val());
    } else {
      undoTextFormChecked(4, $(this).val());
    }
  })
  $('.contents__content__text5').on('click', '.contents__content__text5__check-update__box', function(e){
    if($(this).prop('checked')){
      createTextFormChecked(5, $(this).val());
    } else {
      undoTextFormChecked(5, $(this).val());
    }
  })

  //中止ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__form__update-n', function(e){
    e.preventDefault();
    getCheckedUpdate(1, "update").forEach(i => undoTextFormChecked(1, i));
    interruptProcessUpdateDelete(1, "update");
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__update-n', function(e){
    e.preventDefault();
    getCheckedUpdate(2, "update").forEach(i => undoTextFormChecked(2, i));
    interruptProcessUpdateDelete(2, "update");
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__update-n', function(e){
    e.preventDefault();
    getCheckedUpdate(3, "update").forEach(i => undoTextFormChecked(3, i));
    interruptProcessUpdateDelete(3, "update");
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__update-n', function(e){
    e.preventDefault();
    getCheckedUpdate(4, "update").forEach(i => undoTextFormChecked(4, i));
    interruptProcessUpdateDelete(4, "update");
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__update-n', function(e){
    e.preventDefault();
    getCheckedUpdate(5, "update").forEach(i => undoTextFormChecked(5, i));
    interruptProcessUpdateDelete(5, "update");
  })

  //決定ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__form__update-y', function(e){
    e.preventDefault();
    decisionProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__update-y', function(e){
    e.preventDefault();
    decisionProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__update-y', function(e){
    e.preventDefault();
    decisionProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__update-y', function(e){
    e.preventDefault();
    decisionProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__update-y', function(e){
    e.preventDefault();
    decisionProcess(5);
  })

});