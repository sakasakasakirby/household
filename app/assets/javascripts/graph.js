
/*$(document).ready( function(){

  chart();
  
  $.ajax({
    url: '/api/books',
    type: 'GET',
    data: {date: date, user_id: user_id},  
    dataType: 'json'
  })
  .done(function(data){
    chart();
  })
  .fail(function(){
    alert('DBへの接続に失敗しました');
  })
  

  function chart(){
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Japanese", "Mathematics", "English", "Social studies", "Science"],
        datasets: [{
          label: 'A_kun',
          backgroundColor: "rgba(0,0,80,0.4)",
          borderColor: "rgba(0,0,80,1)",
          data: [80, 90, 60, 70, 100, 70]
        }, {
          label: 'B_kun',
          backgroundColor: "rgba(0,255,0,0.4)",
          borderColor: "rgba(0,255,0,1)",
          data: [90, 75, 80, 65, 80, 70]
        }]
      }
    });
  }
  

});
*/