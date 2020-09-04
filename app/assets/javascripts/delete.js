$(function() {

  //id:1~5の削除ボタンが押された際の挙動
  for(i = 1; i <= 5; i++){
    $('.contents__content__add' + i).on('click', '.contents__content__add' + i + '__delete', function(e){
      console.log(i);
      e.preventDefault();
      alert("削除機能は実装されておりません");
    })
  }
  

});