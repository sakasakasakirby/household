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
      if(data.id == null) {
        alert('項目を追加できませんでした(項目名の文字数が16文字以上になっています。15文字以内にしてください)');
      } else {
        $(`.contents__content__add${num}__form__select`).append($('<option>').html(data.name).val(data.name));
        $(`.contents__content__add${num}__form__list_context`).val("");
        $(`.contents__content__add${num}__form__select`).val(data.name);
      }
    })
    .fail(function(){
      alert('項目を追加できませんでした(項目に入力があること、空白が含まれていないことを確認してください)');
    })
  }

  for(j = 3; j > 0; j--) {
    //リスト追加ボタンが押された際の処理
    $(`.contents__content__add${j}`).on('click', `.contents__content__add${j}__form__add_list`, function(e){
      addListContext(Number(e.target.getAttribute('id').slice(e.target.getAttribute('id').length-1, e.target.getAttribute('id').length)));
    })
  }

});