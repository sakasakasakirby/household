$(document).ready( function(){

  let url = location.href;
  if(url.slice(url.length-1, url.length) === "/" || url.slice(url.length-1, url.length) === "#"){
    createSelectBox();
    let date = createYearMonth();
    let user_id = createUserID();

    $.ajax({
      url: '/api/books',
      type: 'GET',
      data: {date: date, user_id: user_id},  
      dataType: 'json'
    })
    .done(function(data){
      for(i = 0; i < data.length ; i++){
        addHTML(data[i]);
      }
      if(data.length > 0){
        addIncomeHTML(data[0].total_array);
        addTotalHTML(data[0].double_array);
        addUserInfoHTML(data[0].double_array, data[0].target);
      }
    })
    .fail(function(){
      alert('DBへの接続に失敗しました');
    })
  }

  //年のselect_boxの作成と年月の選択
  function createSelectBox(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    addSelectBox(year);
    $('.select__year').val(year);
    $('.select__month').val(month);
  }

  //現在の年から十年前までのselect_boxを作成
  function addSelectBox(year){
    for(i = -1; i < 9; i++){
      y = year - i;
      dis = y + "年"
      $('#select_year').append($('<option>').html(dis).val(y));
    }
  }

});