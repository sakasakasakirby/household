$(function() {

  //チェックされたレコードをフォームにする
  function createTextFormChecked(num, checked_num){
    let context = $('.contents__content__text' + num + '__info__context').eq(checked_num).text();
    let money = $('.contents__content__text' + num + '__money__context').eq(checked_num).text().split(',').join('');
    money = money.slice(0, money.length-1);
    let html = '<input type="text" class="textarea" name="' + context + '" id="context' + checked_num + '" value="' + context + '" size="20" maxlength="20">';
    $('.contents__content__text' + num + '__info__context').eq(checked_num).html(html);
    html = '<input type="text" class="textarea" name="' + money + '" id="money' + checked_num + '" value="' + money + '" size="7" maxlength="10">円';
    $('.contents__content__text' + num + '__money__context').eq(checked_num).html(html);
  }

  //チェックを外されたレコードを元に戻す
  function undoTextFormChecked(num, checked_num){
    let context = $('.contents__content__text' + num + '__info__context').eq(checked_num).children().attr('name');
    let money = Number($('.contents__content__text' + num + '__money__context').eq(checked_num).children().attr('name')).toLocaleString();
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
      if(data.target == null){
        alert('項目名もしくは金額が正しくありません(金額は1~99,999,999の範囲内でお願いします)');
      } else {
        checked_array = getCheckedUpdate(num, "update");
        for(i = 0; i < checked_array.length; i++){
          updateHTML(num, checked_array[i], data.update_array[i]);
        }
        interruptProcessUpdateDelete(num, "update")
        addTabTotalHTML(data.total, num);
        changeIncomeHTML(data.total, num);
        addTotalHTML(data.total_array);
        addUserInfoHTML(data.total_array, data.target);
      }
    })
    .fail(function(){
      alert('値の更新に失敗しました');
    })
  }

  for(j = 5; j > 0; j--) {
    //更新ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__update`, function(e){
      e.preventDefault();
      updateProcess(Number(e.target.className.slice(e.target.className.length-9, e.target.className.length-8)));
    })
    //チェックボックスにチェックされた際の処理
    $(`.contents__content__text${j}`).on('click', `.contents__content__text${j}__check-update__box`, function(e){
      if($(this).prop('checked')){
        createTextFormChecked(Number(e.target.className.slice(e.target.className.length-20, e.target.className.length-19)), $(this).val());
      } else {
        undoTextFormChecked(Number(e.target.className.slice(e.target.className.length-20, e.target.className.length-19)), $(this).val());
      }
    })
    //中止ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__update-n`, function(e){
      e.preventDefault();
      getCheckedUpdate(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)), "update").forEach(i => undoTextFormChecked(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)), i));
      interruptProcessUpdateDelete(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)), "update");
    })
    //決定ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__update-y`, function(e){
      e.preventDefault();
      decisionProcess(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)));
    })
  }

});