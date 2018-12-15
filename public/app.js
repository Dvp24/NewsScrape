$.getJSON("/scrape", function (data) {
  if (data) {
    getArticles();
  }
});

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
        $("#articles").append("<p data-id='" + articleData[i]._id + "'>" + articleData[i].title + "</p>");
      }
    })
}

