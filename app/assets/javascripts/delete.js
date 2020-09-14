$(function() {

  function getChecked(num){
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check__box"]:checked').each(function() {
      check_array.push($(this).val());
    })
    delete_array = []
    count = 0
    for(i = 0; i < check_array.length; i++){
      n = Number(check_array[i]);
      array = []
      if(num <= 2){
        let date = $('.contents__content__text' + num + '__date__context').eq(n).text();
        date = date.split('/');
        m = date[0]
        d = date[1]
        if(m.length == 1){
          m = "0" + m;
        }
        if(d.length == 1){
          d = "0" + d;
        }
        array.push($('.select__year').val() + "-" + m + "-" + d);
      } else {
        m = $('.select__month').val();
        if(m.length == 1){
          m = "0" + m;
        }
        array.push($('.select__year').val() + "-" + m);
      }
      array.push($('.contents__content__text' + num + '__info__context').eq(n).text());
      let money = $('.contents__content__text' + num + '__money__context').eq(n).text();
      array.push(money.slice(0, money.length-1));
      delete_array.push(array);
    }
    return delete_array;
  }

  //buildHTMLメソッド
  function createButtonHTML(num){
    let html = '<div class="contents__content__add' + num + '__form">';
    html += '<form>';
    html += '<input type="submit" class="contents__content__add' + num + '__form__delete-y" value="決定">';
    html += '<input type="submit" class="contents__content__add' + num + '__form__delete-n" value="中止">';
    html += '</form>';
    html += '</div>';
    return html;
  }

  function createCheckBoxHTML(num){
    count = $('.contents__content__text' + num + '__money__context').length - 1;
    let html = '<div class="contents__content__text' + num + '__check">';
    for(i = 0; i < count; i++){
      html += '<input type="checkbox" id="box' + i + '" class="contents__content__text' + num + '__check__box" value="' + i + '">';
    }
    html += '</div>';
    return html;
  }

  function returnHTML(num) {
    let html = '<a class="contents__content__add' + num + '__button" href="#">追加</a>';
    html += '<a class="contents__content__add' + num + '__delete" href="#">削除</a>';
    return html;
  }

  function deleteHTML(num) {
    let check_array = [];
    $('input:checkbox[class="contents__content__text' + num + '__check__box"]:checked').each(function() {
      check_array.push($(this).val());
    })
    count = 0
    for(i = 0; i < check_array.length; i++){
      n = Number(check_array[i]) - count;
      $('.contents__content__text' + num + '__date__context').eq(n).remove();
      $('.contents__content__text' + num + '__info__context').eq(n).remove();
      $('.contents__content__text' + num + '__money__context').eq(n).remove();
      count++;
    }
  }

  function addTabTotalHTML(data){
    let id = data.item_id;
    let total = data.income + "円";
    $('.contents__content__text' + id + '__money__sum').text(total);
  }

  function addIncomeHTML(data){
    let id = data.item_id;
    let total = data.income + "円";
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
    html = "";
    for(i = 0; i < array[1].length; i++){
      html += '<div class="contents__content__text7__money__context">' + array[1][i] + '円</div>';
      total_money += array[1][i]
    }
    html += '<div class="contents__content__text7__money__context contents__content__text7__money__sum">' + total_money + '円</div>';
    $('.contents__content__text7__money').append(html);
  }

  function addUserInfoHTML(double_array){
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
    //仮設定
    target = 1000000;
    remaining = target - total;
    $('.user-management__display__info__context__right__income').text(income + "円");
    $('.user-management__display__info__context__right__total').text(total + "円");
    $('.user-management__display__info__context__right__target').text(target + "円");
    $('.user-management__display__info__context__right__remaining').text(remaining + "円");
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

  function interruptProcess(num){
    $('.contents__content__add' + num + '__form').remove();
    $('.contents__content__text' + num + '__check').remove();
    let html = returnHTML(num);
    $('.contents__content__add' + num).append(html);
  }

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
      addIncomeHTML(data);
      addTotalHTML(data.total_array);
      addUserInfoHTML(data.total_array);
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