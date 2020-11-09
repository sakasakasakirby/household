$(function() {

  //リストに項目を追加
  function addListContext(num) {
    let name = $('.text' + num).val();
    $.ajax({
      url: '/lists',
      type: 'POST',
      data: {item_id: num, name: name},
      dataType: 'json'
    })
    .done(function(data){
      $(`.select${num}`).append($('<option>').html(data.name).val(data.id));
      $(`.text${num}`).val("");
      $(`.select${num}`).val(data.id);
    })
    .fail(function(){
      alert('項目の追加に失敗しました(項目に空白が含まれないようにしてください)');
    })
  }

  //リストから項目を削除
  function deleteListContext(num) {
    let id = $('.select' + num).val();
    let url = "/lists/" + $(".return").attr("class").slice(11);
    $.ajax({
      url: url,
      type: 'DELETE',
      data: {list_id: id},
      dataType: 'json'
    })
    .done(function(data){
      $(`select.select${num} option[value=${id}]`).remove();
    })
    .fail(function(){
      alert('項目の削除に失敗しました');
    })
  }

  for(j = 3; j > 0; j--) {
    //追加ボタンが押された際の処理
    $(`.board__list`).on('click', `.list_add${j}`, function(e){
      e.preventDefault();
      addListContext(Number(e.target.className.slice(e.target.className.length-1, e.target.className.length)));
    })
    //削除ボタンが押された際の処理
    $(`.board__list`).on('click', `.list_delete${j}`, function(e){
      e.preventDefault();
      deleteListContext(Number(e.target.className.slice(e.target.className.length-1, e.target.className.length)));
    })
  }

});