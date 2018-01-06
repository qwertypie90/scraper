$(document).ready(function() {

    var articleContainer = $("tbody");
    var articles;

    function scrape(articles) {
        event.preventDefault();
        $("tbody").empty();
        $.getJSON("/all", function(data) {
            articles = data;
            if (!articles || !articles.length) {
                console.log("NOTHING")
            } else {
                initializeRows(articles);
            }
        });
    }


    // Handling the building/display of rows
    function initializeRows(articles) {
        for (var i = 0; i < articles.length; i++) {
            var articleId = articles[i]._id;
            var title = articles[i].title;
            var link = articles[i].link;

            var tempRow = $('<tr class = "xyz">')
            var tableInfo = "<td>" + title + "</td><td>" + link + "</td><td><input type='button'value='Add Comment' class='addBtns' id='" + articles[i]._id + "'/></td></tr>";

            tempRow.append(tableInfo)

            articleContainer.append(tempRow)

        }
    }

    $("#scrape").on("click", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        scrape()
    })









    // function scrape(articles) {
    //     // First, empty the table
    //     $("tbody").empty();
    //     // Then, for each entry of that json...
    //     articles.forEach(function(article) {
    //         // Append each of the animal's properties to the table
    //         id = article._id
    //         console.log(id)
    //         $("tbody").append("<tr><td>" + article.title + "</td>" +
    //             "<td>" + article.link + "</td>" +
    //             "<td><button id='Add'>Add Comment</button</td></tr>");
    //     });
    // }

    // $("#scrape").on("click", function(event) {
    //     // Make sure to preventDefault on a submit event.
    //     event.preventDefault();
    //     $.getJSON("/all", function(data) {
    //         // Call our function to generate a table body
    //         scrape(data);
    //         console.log(data)
    //     })
    // })

    $(document).on("click", ".addBtns", function(articles) {
        event.preventDefault();
        console.log("button works")

        BootstrapDialog.show({
            title: 'Add Comment For ' + $(this).attr("id"),
            message: $('<textarea class="form-control" placeholder="Add your comment for this article here..."></textarea>'),
            buttons: [{
                label: 'Save Comment',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function() {
                    alert('Comment Saved =)');
                }
            }]
        });

        // $("#myModal").modal("show");

        // var newComment = {
        //     title: $("#name").val().trim(),
        //     photo: $("#photo").val().trim(),
        //     scores: answers
        // };

        // console.log(newFriend)

        //    var currentURL = window.location.origin;
        //         //AJAX posts the data to friends API.
        //         $.post(currentURL + "/api/matches", newFriend, function(data) {
        //             if (data.name !== undefined) {
        //                 matchStatus.html('Your DREAM BOAT SUPREME...');
        //                 modalBody.html('<p>...is ' + data.name + '!</p><img src="' + data.photo + '" height="200">');
        //             } else {
        //                 // If no match, show this
        //                 matchStatus.html('Not enough data!');
        //                 modalBody.html('<p>Unfortunately there is not yet enough user data to match you</p>');
        //             }
        //             // Toggle modal on
        //             $('.modal').modal('toggle');
        // })
        //     // $.ajax({
        //   type: "POST",
        //   dataType: "json",
        //   url: "/saved",
        //   data: {
        //     title: $(this).
        //     // note: $("#note").val(),
        //     // created: Date.now()
        //   }
        // })
        // // If that API call succeeds, add the title and a delete button for the note to the page
        // .done(function(data) {
        //   // Add the title and delete button to the #results section
        //   $("#results").prepend("<p class='dataentry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
        //     data._id + ">" + data.title + "</span><span class=deleter>X</span></p>");
        //   // Clear the note and title inputs on the page
        //   $("#note").val("");
        //   $("#title").val("");
        // }
        // );
    });






});