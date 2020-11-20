//= require jquery
//= require rails-ujs
//= require_tree .
//= require chartkick
//= require Chart.bundle
//= require Chart.min

/*汎用*/
//文字列year-monthを作成
function createYearMonth(){
  month = "" + $('.select__month').val();
  if(month.length == 1){
    month = "0" + month;
  }
  let date = $('.select__year').val() + "-" + month;
  return date
}
//文字列year-month-dayを作成
function createYearMonthDay(){
  let now = new Date();
  let year = $('.select__year').val();
  let month = $('.select__month').val()
  if(month.length == 1){
    month = "0" + month;
  }
  let day = ("0"+now.getDate()).slice(-2);
  let today = year + "-" + month + "-" + day;
  return today
}
//選択した項目の文字列year-month-dayを作成
function createDisplayYearMonthDay(num, select_num){
  let date = $('.contents__content__text' + num + '__date__context').eq(select_num).text();
  date = date.split('/');
  m = date[0]
  d = date[1]
  if(m.length == 1){
    m = "0" + m;
  }
  if(d.length == 1){
    d = "0" + d;
  }
  return $('.select__year').val() + "-" + m + "-" + d;
}
//user_idの取得
function createUserID(){
  let user_str = $(".user").attr("class");
  let user_id = user_str.slice(9);
  return user_id
}

/*ready.js, select.js, add.jsで使用*/
//DBに保存された支出と収支のタブの各項目を表示
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
  //if(data.item_id == 1 || data.item_id == 2){
    let html = '<div class="contents__content__text' + data.item_id + '__date__context">' + date + '</div>';
    html += '<div class="contents__content__text' + data.item_id + '__date__context contents__content__text' + data.item_id + '__date__sum"></div>';
    $('.contents__content__text' + data.item_id + '__date').append(html);
  //}
  html = '<div class="contents__content__text' + data.item_id + '__info__context">' + data.name + '</div>';
  html += '<div class="contents__content__text' + data.item_id + '__info__context contents__content__text' + data.item_id + '__info__sum">total</div>';
  $('.contents__content__text' + data.item_id + '__info').append(html);
  html = '<div class="contents__content__text' + data.item_id + '__money__context">' + data.money.toLocaleString() + '円</div>';
  html += '<div class="contents__content__text' + data.item_id + '__money__context contents__content__text' + data.item_id + '__money__sum">' + data.total.toLocaleString() + '円</div>';
  $('.contents__content__text' + data.item_id + '__money').append(html);
  $('.contents__content__text' + data.item_id).animate({ scrollTop: $('.contents__content__text' + data.item_id)[0].scrollHeight})
}

/*ready.js, add.js, delete.jsで使用*/
//トータルのタブの項目の表示
function addTotalHTML(array){
  $('.contents__content__text7__info__context').remove();
  let html = "";
  for(i = 0; i < array[0].length; i++){
    html += '<div class="contents__content__text7__info__context">' + array[0][i] + 'の収支</div>';
  }
  html += '<div class="contents__content__text7__info__context contents__content__text7__info__sum">total</div>';
  $('.contents__content__text7__info').append(html);
  $('.contents__content__text7__money__context').remove();
  let total_money = 0;
  let count_array = [];
  html = "";
  for(i = 0; i < array[1].length; i++){
    html += '<div class="contents__content__text7__money__context">' + array[1][i].toLocaleString() + '円</div>';
    total_money += array[1][i];
    if(array[1][i] < 0){
      count_array += i;
    }
  }
  html += '<div class="contents__content__text7__money__context contents__content__text7__money__sum">' + total_money.toLocaleString() + '円</div>';
  $('.contents__content__text7__money').append(html);
  for(i = 0; i < count_array.length; i++) {
    $('.contents__content__text7__money__context').eq(count_array[i]).addClass("minus");
  }
}
//ユーザ情報の表示
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
  $('.user-management__display__info__context__right__income').text(income.toLocaleString() + "円");
  $('.user-management__display__info__context__right__total').text(total.toLocaleString() + "円");
  $('.user-management__display__info__context__right__target').text(target.toLocaleString() + "円");
  $('.user-management__display__info__context__right__remaining').text(remaining.toLocaleString() + "円");
}

/*ready.js, select.jsで使用*/
//今月の収支タブの項目の表示
function addIncomeHTML(array){
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

/*add.js, update.js, delete.jsで使用*/
//追加、更新、削除ボタンのいずれかが押された際にその全てのボタンをブラウザから削除
function deleteButtonHTML(num){
  $('.contents__content__add' + num + '__button').remove();
  $('.contents__content__add' + num + '__update').remove();
  $('.contents__content__add' + num + '__delete').remove();
}
//追加、更新、削除ボタンの作成
function returnHTML(num) {
  let html = '<a class="contents__content__add' + num + '__button" href="#">追加</a>';
  html += '<a class="contents__content__add' + num + '__update" href="#">編集</a>';
  html += '<a class="contents__content__add' + num + '__delete" href="#">削除</a>';
  return html;
}
//今月の収支タブの項目の変更
function changeIncomeHTML(tab_total, id){
  let total = tab_total.toLocaleString() + "円";
  $('.contents__content__text6__money__context').eq(5-id).text(total);
  let income = 0;
  let inc = $('.contents__content__text5__money__sum').eq(0).text();
  inc = inc.substr(0, inc.length-1);
  inc = Number(inc.split(',').join(''));
  if(inc){
    income += inc;
  }
  for(i = 1; i < 5; i++){
    inc = $('.contents__content__text' + i + '__money__sum').eq(0).text();
    let inc_num = inc.substr(0, inc.length-1);
    inc_num = Number(inc_num.split(',').join(''));
    if(inc_num){
      income -= inc_num;
    }
  }
  let income_str = income.toLocaleString() + "円";
  $('.contents__content__text6__money__context').eq(5).text(income_str);
}
//出費ランキングの更新
function moneyRankingHTML(array){
  $('.des_textarea1').text("第一位 : なし");
  $('.des_textarea2').text("第二位 : なし");
  $('.des_textarea3').text("第三位 : なし");
  if(array[0] != null){
    $('.des_textarea1').text("第一位 : " + array[0]);
  }
  if(array[1] != null){
    $('.des_textarea2').text("第二位 : " + array[1]);
  }
  if(array[2] != null){
    $('.des_textarea3').text("第三位 : " + array[2]);
  }
}

/*add.js, delete.jsで使用*/
//本日のまとめの更新
function currentInfoHTML(array){
  console.log(array);
  $('.bulletin_board__context__message__expense').text("本日の支出 : " + array[0].toLocaleString() + "円");
  $('.bulletin_board__context__message__income').text("本日の収入 : " + array[1].toLocaleString() + "円");
  if(array[2] != null){
    $('.bulletin_board__context__message__current').text("最新の出費 : " + array[2]);
  } else {
    $('.bulletin_board__context__message__current').text("最新の出費 : 本日入力なし");
  }
}

/*update.js, delete.jsで使用*/
//更新、削除ボタンが押された際のフォームの作成
function createButtonHTML(num, button){
  let html = '<div class="contents__content__add' + num + '__form">';
  html += '<form>';
  html += '<input type="submit" class="contents__content__add' + num + '__form__' + button + '-y" value="決定">';
  html += '<input type="submit" class="contents__content__add' + num + '__form__' + button + '-n" value="中止">';
  html += '</form>';
  html += '</div>';
  return html;
}
//更新、削除したい項目を選択するためのチェックボックスの作成
function createCheckBoxHTML(num, button){
  count = $('.contents__content__text' + num + '__money__context').length - 1;
  let html = '<div class="contents__content__text' + num + '__check-' + button + '">';
  for(i = 0; i < count; i++){
    html += '<input type="checkbox" id="box' + i + '" class="contents__content__text' + num + '__check-' + button + '__box" value="' + i + '">';
  }
  html += '</div>';
  return html;
}
//フォームの削除
function interruptProcessUpdateDelete(num, button){
  $('.contents__content__add' + num + '__form').remove();
  $('.contents__content__text' + num + '__check-' + button).remove();
  let html = returnHTML(num);
  $('.contents__content__add' + num).append(html);
}
//更新、削除した項目があるタブのtotalを更新
function addTabTotalHTML(tab_total, id){
  let total = tab_total.toLocaleString() + "円";
  $('.contents__content__text' + id + '__money__sum').text(total);
}