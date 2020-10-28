$(function() {

  //追加ボタンが押された際の入力フォームの作成
  function createFormHTML(num){
    let today = createYearMonthDay();
    let html = '<div class="contents__content__add' + num + '__form">';
    html += '<form>';
    html += '<input type="date" class="contents__content__add' + num + '__form__calendar" max="9999-12-31" value="' + today + '">';
    if(num == 4) {
      html += '追加内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" value="家賃" placeholder="追加したい項目">';
    } else if(num == 5) {
      html += '追加内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" value="給料" placeholder="追加したい項目">';
    } else {
      html += '追加内容:<input type="text" class="contents__content__add' + num + '__form__context" size="13" placeholder="追加したい項目">';
    }
    html += '追加金額:<input type="text" class="contents__content__add' + num + '__form__money" size="6" placeholder="金額">';
    html += '<input type="submit" class="contents__content__add' + num + '__form__button-y" value="決定">';
    html += '<input type="submit" class="contents__content__add' + num + '__form__button-n" value="中止">';
    html += '</form>';
    html += '</div>';
    return html;
  }

  //ボタン押下時の処理
  function addProcess(num){
    $('.contents__content__add' + num + '__button').remove();
    $('.contents__content__add' + num + '__delete').remove();
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
      interruptProcess(num);
      let get_date = data.date.substr(0, data.date.length-3);
      if(date === get_date){
        addHTML(data);
        changeIncomeHTML(data);
      }
      addTotalHTML(data.total_array);
      addUserInfoHTML(data.total_array, data.target);
    })
    .fail(function(){
      alert('登録に失敗しました');
    })
  }

  //追加ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__button', function(e){
    e.preventDefault();
    addProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__button', function(e){
    e.preventDefault();
    addProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__button', function(e){
    e.preventDefault();
    addProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__button', function(e){
    e.preventDefault();
    addProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__button', function(e){
    e.preventDefault();
    addProcess(5);
  })

  //中止ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__form__button-n', function(e){
    e.preventDefault();
    interruptProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__button-n', function(e){
    e.preventDefault();
    interruptProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__button-n', function(e){
    e.preventDefault();
    interruptProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__button-n', function(e){
    e.preventDefault();
    interruptProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__button-n', function(e){
    e.preventDefault();
    interruptProcess(5);
  })

  //決定ボタン押された際の処理
  $('.contents__content__add1').on('click', '.contents__content__add1__form__button-y', function(e){
    e.preventDefault();
    decisionProcess(1);
  })
  $('.contents__content__add2').on('click', '.contents__content__add2__form__button-y', function(e){
    e.preventDefault();
    decisionProcess(2);
  })
  $('.contents__content__add3').on('click', '.contents__content__add3__form__button-y', function(e){
    e.preventDefault();
    decisionProcess(3);
  })
  $('.contents__content__add4').on('click', '.contents__content__add4__form__button-y', function(e){
    e.preventDefault();
    decisionProcess(4);
  })
  $('.contents__content__add5').on('click', '.contents__content__add5__form__button-y', function(e){
    e.preventDefault();
    decisionProcess(5);
  })
  
});