$(function()  {

  function buildHTML(num){
    let html = '<div class="contents__content__add' + num + '__form">';
    html += '<form>';
    html += '<input type="date" class="contents__content__add' + num + '__form__calendar" max="9999-12-31">';
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

  function returnHTML(num) {
    let html = '<a class="contents__content__add' + num + '__button" href="#">追加</a>';
    return html;
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

    $('.contents__content__text' + data.item_id).animate({ scrollTop: $('.contents__content__text' + data.item_id)[0].scrollHeight})
  }


  function addProcess(num){
    $('.contents__content__add' + num + '__button').remove();
    let html = buildHTML(num);
    $('.contents__content__add' + num).append(html);
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


  function interruptProcess(num){
    $('.contents__content__add' + num + '__form').remove();
    let html = returnHTML(num);
    $('.contents__content__add' + num).append(html);
  }

  function addIncomeHTML(data){
    let id = data.item_id;
    let total = data.total + "円";
    $('.contents__content__text6__money__context').eq(5-id).text(total);

    let income = 0;
    let inc = $('.contents__content__text5__money__sum').eq(0).text();
    inc = Number(inc.substr(0, inc.length-1));
    if(inc){
      income += inc;
    }
    for(i = 1; i < 5; i++){
      inc = $('.contents__content__text' + i + '__money__sum').eq(0).text();
      let inc_num = Number(inc.substr(0, inc.length-1))
      if(inc_num){
        income -= inc_num;
      }
    }
    let income_str = income + "円";
    $('.contents__content__text6__money__context').eq(5).text(income_str);
    
  }

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


  function decisionProcess(num){
    let name = $('.contents__content__add' + num + '__form__context').val();
    let money = $('.contents__content__add' + num + '__form__money').val();
    let date = $('.contents__content__add' + num + '__form__calendar').val();
    $.ajax({
      url: '/books',
      type: 'POST',
      data: {name: name, money: money, date: date, item_id: num},
      dataType: 'json'
    })
    .done(function(data){
      interruptProcess(num);
      let get_date = data.date.substr(0, data.date.length-3);
      let month = "" + $('.select__month').val();
      if(month.length == 1){
        month = "0" + month;
      }
      let date = $('.select__year').val() + "-" + month;
      if(date === get_date){
        addHTML(data);
        addIncomeHTML(data);
      }
      
    })
    .fail(function(){
      alert('登録に失敗しました');
    })
  }

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