
$("#submit").on("click",function(){
  $.get("/scrape", function(data){
    if (data) {
      getArticles();
    }
  })
})
$(document).on("click", ".saveIt", function(){
 var dataId = $(this).attr('data-id');

 $.ajax({
   url: "/save/" + dataId,
   method: "PUT"
 }).then(function(data) {
   console.log(data);
 })
 
  
})

function getArticles() {
  $.ajax({
    url: "/api/articles",
    method: "GET"
  })
    .then(function (articleData) {
      // For each one
      $("#articles").empty();
      for (var i = 0; i < articleData.length; i++) {
        // Display the apropos information on the page
        // $("#articles").append("<div class='card' data-id='" + articleData[i]._id + "'><div class='white card-header'>"+articleData[i].title+ "<button class='saveIt'data-id='" + articleData[i]._id +"> save </button></div>" +"</br>"+"<div class='card-body'>"+articleData[i].para+"</br>"+"- By "+articleData[i].author +"</div></div>");

        $("#articles").append(`<div class="card" data-id=${articleData[i]._id}><div class="white card-header">${articleData[i].title}</div><button class="saveIt" data-id=${articleData[i]._id}>Save</button><div class="card-body">${articleData[i].para}<br/> - By ${articleData[i].author}</div></div>`);
      }
    })
}
function getSaved() {
  $.ajax({
    url: "/api/saved-articles",
    method: "GET"
  })
    .then(function (savedData) {
      // For each one
      $("#articles").empty();
      for (var i = 0; i < savedData.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<div class='card' data-id='" + articleData[i]._id + "'><div class='white card-header'>"+articleData[i].title+ "<button class='delete'> delete </button></div>" +"</br>"+"<div class='card-body'>"+articleData[i].para+"</br>"+"- By "+articleData[i].author +"</div></div>");
      }
    })
}

