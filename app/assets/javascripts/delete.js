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
      moneyRankingHTML(data.rank);
      currentInfoHTML(data.today_info);
    })
    .fail(function(){
      alert('削除する項目を選択してください');
    })
  }

  for(j = 5; j > 0; j--) {
    //削除ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__delete`, function(e){
      e.preventDefault();
      deleteProcess(Number(e.target.className.slice(e.target.className.length-9, e.target.className.length-8)));
    })
    //中止ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__delete-n`, function(e){
      e.preventDefault();
      interruptProcessUpdateDelete(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)), "delete");
    })
    //決定ボタン押された際の処理
    $(`.contents__content__add${j}`).one('click', `.contents__content__add${j}__form__delete-y`, function(e){
      e.preventDefault();
      decisionProcess(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)));
    })
  }

});