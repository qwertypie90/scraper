$(function() {

    function scrape(articles) {
        // First, empty the table
        $("tbody").empty();
        // Then, for each entry of that json...
        articles.forEach(function(article) {
            // Append each of the animal's properties to the table
            $("tbody").append("<tr><td>" + article.title + "</td>" +
                "<td>" + article.link + "</td></tr>");
        });
    }

    $("#scrape").on("click", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        $.getJSON("/all", function(data) {
            // Call our function to generate a table body
            scrape(data);
            console.log(data)
        })
    })
});