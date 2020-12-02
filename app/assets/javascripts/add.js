$(function() {

  //追加ボタンが押された際の入力フォームの作成
  function createFormHTML(num){
    let today = createYearMonthDay();
    let html = '<div class="contents__content__add' + num + '__form">';
    html += '<form>';
    html += '<div class="flex">';
    html += '<div class="add_list' + num + '"></div>';
    html += '<div>';
    html += '<input type="date" class="contents__content__add' + num + '__form__calendar" max="9999-12-31" value="' + today + '">';
    html += '<span class="context' + num + '">';
    if(num == 4) {
      html += '内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" value="家賃" placeholder=" 追加したい項目">';
    } else if(num == 5) {
      html += '内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" value="給料" placeholder=" 追加したい項目">';
    } else {
      html += '内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" placeholder=" 追加したい項目">';
      html += '<button type="button" id="select' + num + '" class="contents__content__add' + num + '__form__select-frequency" value="リスト"><i id="select' + num + '" class="fas fa-list-ul"></i><div class="description des_select">よく使う項目の選択へ</div></button>';
    }
    html += '</span>';
    html += '金額:<input type="text" class="contents__content__add' + num + '__form__money" size="6" placeholder="1000">';
    html += '<input type="submit" class="contents__content__add' + num + '__form__button-y" value="決定">';
    html += '<input type="submit" class="contents__content__add' + num + '__form__button-n" value="中止">';
    html += '</div>';
    html += '</div>';
    html += '</form>';
    html += '</div>';
    return html;
  }

  //テキストボックスをセレクトボックスへ変更
  function changeToSelectBox(num){
    let url = "/books/" + $(".user").attr("class").slice(9) + "/select_box";
    let date = createYearMonth();
    $.ajax({
      url: url,
      type: 'GET',
      data: {date: date, item_id: num},
      dataType: 'json'
    })
    .done(function(data){
      array = data.array;
      let html = '内容:<select class="contents__content__add' + num + '__form__select">';
      if(array.length == 0) {
        if(num == 1){
          html += '<option value="食費">食費</option><option value="雑費">雑費</option><option value="交際費">交際費</option>';
        } else if(num == 2){
          html += '<option value="洋服">洋服</option><option value="家具">家具</option>';
        } else {
          html += '<option value="電気代">電気代</option><option value="水道代">水道代</option><option value="ガス代">ガス代</option><option value="携帯代">携帯代</option>';
        }
      } else {
        for(i = 0; i < array.length; i++){
          html += '<option value="' + array[i] + '">' + array[i] + '</option>';
        }
      }
      html += '</select>';
      html += '<button type="button" id="write' + num + '" class="contents__content__add' + num + '__form__select-frequency"><i id="write' + num + '" class="fas fa-edit"></i><div class="description des_write">手入力へ</div></button>';
      $(".context" + num).html(html);
      html = '<input type="text" class="contents__content__add' + num + '__form__list_context" size="5" placeholder="よく使うリスト">';
      html += '<button type="button" id="list' + num + '" class="contents__content__add' + num + '__form__add_list" value="リスト追加">追加</button>';
      $(".add_list" + num).html(html);
    })
    .fail(function(){
      alert('セレクトボックスの作成に失敗しました');
    })
  }

  //セレクトボックスをテキストボックスへ変更
  function changeToTextBox(num){
    let html = '内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" placeholder=" 追加したい項目">';
    html += '<button type="button" id="select' + num + '" class="contents__content__add' + num + '__form__select-frequency"><i id="select' + num + '" class="fas fa-list-ul"></i><div class="description des_select">よく使う項目の選択へ</div></button>';
    $(".context" + num).html(html);
    $(".add_list" + num).html("");
  }

  //ボタン押下時の処理
  function addProcess(num){
    deleteButtonHTML(num);
    let html = createFormHTML(num);
    $('.contents__content__add' + num).append(html);
  }

  //フォームの削除
  function interruptProcess(num){
    $('.contents__content__add' + num + '__form').remove();
    let html = returnHTML(num);
    $('.contents__content__add' + num).append(html);
  }

  //決定
  function decisionProcess(num){
    let name = $('.contents__content__add' + num + '__form__context').val();
    if(name == undefined) {
      name = $('.contents__content__add' + num + '__form__select').val();
    }
    let money = $('.contents__content__add' + num + '__form__money').val();
    let submit_date = $('.contents__content__add' + num + '__form__calendar').val();
    let date = createYearMonth();
    let user_id = createUserID();
    
    $.ajax({
      url: '/books',
      type: 'POST',
      data: {name: name, money: money, date: submit_date, item_id: num, user_id: user_id},
      dataType: 'json'
    })
    .done(function(data){
      console.log(data.name.length);
      if(data.money == null){
        alert('金額は、半角かつ1~99,999,999の範囲で入力してください');
      } else if(data.name.length > 15) {
        alert('項目名は15文字以内で入力してください');
      } else {
        interruptProcess(num);
        let get_date = data.date.substr(0, data.date.length-3);
        if(date === get_date){
          addHTML(data);
          changeIncomeHTML(data.total, data.item_id);
        }
        addTotalHTML(data.total_array);
        addUserInfoHTML(data.total_array, data.target);
        moneyRankingHTML(data.rank);
        currentInfoHTML(data.today_info);
      }
    })
    .fail(function(){
      alert('追加したい項目もしくは金額を正しく入力してください(各入力フォームに入力があること、空白が含まれていないことを確認してください)');
    })
  }

  for(j = 5; j > 0; j--) {
    //追加ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__button`, function(e){
      e.preventDefault();
      addProcess(Number(e.target.className.slice(e.target.className.length-9, e.target.className.length-8)));
    })
    //よく使う項目ボタン押された際の処理
    if(j <= 3) {
      $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__select-frequency`, function(e){
        e.preventDefault();
        if(e.target.getAttribute('id').slice(0, e.target.getAttribute('id').length-1) == "select"){
          changeToSelectBox(Number(e.target.getAttribute('id').slice(e.target.getAttribute('id').length-1, e.target.getAttribute('id').length)));
        } else {
          changeToTextBox(Number(e.target.getAttribute('id').slice(e.target.getAttribute('id').length-1, e.target.getAttribute('id').length)));
        }
      })
    }
    //中止ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__button-n`, function(e){
      e.preventDefault();
      interruptProcess(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)));
    })
    //決定ボタン押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__button-y`, function(e){
      e.preventDefault();
      decisionProcess(Number(e.target.className.slice(e.target.className.length-17, e.target.className.length-16)));
    })
  }
  
});