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

            var tempRow = $("<tr class = 'xyz' id= " + i + ">")
            var tableInfo = "<td>" + title + "</td><td>" + link + "</td><td><input type='button'value='Add Comment' class='addBtns' id=" + articles[i]._id + "></td></tr>";

            tempRow.append(tableInfo)

            articleContainer.append(tempRow)

        }
    }

    $("#scrape").on("click", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        scrape()
    })

    $(document).on("click", ".addBtns", function(articles) {
        event.preventDefault();
        console.log("button works")
        var important = $(this).attr("id");
        var trToReplace = $(this).closest("tr.xyz");

        BootstrapDialog.show({
            title: 'Add Comment For ' + important,
            message: $('<textarea class="form-control" id = "message" placeholder="Add your comment for this article here..."></textarea>'),
            buttons: [{
                label: 'Save Comment',
                cssClass: 'btn-primary',
                hotkey: 13, // Enter.
                action: function() {
                    //Handle Save Note button
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        url: "/comments/save/" +important,
                        data: {
                            text: $("#message").val()
                        }
                    }).done(function(data) {
                        BootstrapDialog.closeAll();
                        // Log the response
                        // console.log(data);
                        // console.log($("#message"))
                        // window.location = "/saved"
                        // dynamically fetch the id of tr, .xyz from the clicked element.
                        // console.log(trToReplace);
                        $(trToReplace).append("<td><input type='button'value='Edit Comment' class='editBtn' id='" + important + "'/></td><td><input type='button'value='Delete Comment' class='deleteBtn' id='" + important + "'/></td>");
                    });

                }
            }]
        });

    });


});