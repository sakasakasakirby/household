$(function() {

  //リストに項目を追加
  function addListContext(num) {
    let name = $('.contents__content__add' + num + '__form__list_context').val();
    $.ajax({
      url: '/lists',
      type: 'POST',
      data: {item_id: num, name: name},
      dataType: 'json'
    })
    .done(function(data){
      $(`.contents__content__add${num}__form__select`).append($('<option>').html(data.name).val(data.name));
      $(`.contents__content__add${num}__form__list_context`).val("");
    })
    .fail(function(){
      alert('リスト項目の追加に失敗しました');
    })
  }

  for(j = 3; j > 0; j--) {
    //リスト追加ボタンが押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__add_list`, function(e){
      addListContext(Number(e.target.getAttribute('id').slice(e.target.getAttribute('id').length-1, e.target.getAttribute('id').length)));
    })
  }

});