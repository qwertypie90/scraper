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
                // checkIfComments(articles)
            }
        });
    }

    // Handling the building/display of rows
    function initializeRows(articles) {
        for (var i = 0; i < articles.length; i++) {
            var articleId = articles[i]._id;
            var title = articles[i].title;
            var link = articles[i].link;
            var comID;
            var tempRow = $("<tr class = 'xyz' id= " + i + ">")
            var tableInfo = "<td>" + title + "</td><td>" + link + "</td><td><input type='button'value='Add Comment' class='addBtns' id=" + articles[i]._id + "></td></tr>";

            if (!articles[i].comments) {
                tempRow.append(tableInfo)

            } else {
                var altInfo = "<td>" + title + "</td><td>" + link + "</td><td>Comment Stored</td><td><input type='button'value='Edit Comment' data-name = " + comID + " class='editBtn' id='" + articleId + "'/></td><td><input type='button'value='Delete Comment' data-name= " + comID + " class='deleteBtn' id='" + articleId + "'/></td></tr>"
                tempRow.append(altInfo)
            }

            articleContainer.append(tempRow)
        }
    }

    $("#scrape").on("click", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        scrape()
    })


    //     function checkIfComments(articles) {
    //     event.preventDefault();
    //     $.getJSON("/all", function(data) {
    //         articles = data;
    //         console.log(articles)
    //         // if there are comments under each articles then
    //         //     print the added col span thing for each article
    //         var trToReplace = $(this).closest("tr.xyz");
    //         var arg = [];
    //         var comID;
    //         var articleID;
    //         for (var i = 0; i < articles.length; i++) {
    //             if (articles[i].comments) {
    //                 arg.push(trToReplace)
    //                 console.log(arg)
    //                 articles[i]._id = articleID
    //                 articles[i].comments[0]._id = comID
    //                 $(".addBtns").empty()

    //                 // $(trToReplace).append("<td><input type='button'value='Edit Comment' data-name = " + comID + " class='editBtn' id='" + articleID + "'/></td><td><input type='button'value='Delete Comment' data-name= " + comID + " class='deleteBtn' id='" + articleID + "'/></td>");
    //                 console.log("YUP")

    //             }
    //         }
    //     })
    // }


    $(document).on("click", ".addBtns", function(articles) {
        event.preventDefault();
        console.log("button works")
        var important = $(this).attr("id");
        var commentID;
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
                        url: "/comments/save/" + important,
                        data: {
                            text: $("#message").val()
                        }
                    }).done(function(data) {
                        BootstrapDialog.closeAll();
                        // Log the response
                        // console.log(data);
                        // console.log(commentID)
                        commentID = data._id
                        // console.log($("#message"))
                        // window.location = "/saved"
                        // dynamically fetch the id of tr, .xyz from the clicked element.
                        console.log(trToReplace[0]);
                        $(trToReplace).append("<td><input type='button'value='Edit Comment' data-name = " + commentID + " class='editBtn' id='" + important + "'/></td><td><input type='button'value='Delete Comment' data-name= " + commentID + " class='deleteBtn' id='" + important + "'/></td>");
                    });

                }
            }]
        });

    });



    $(document).on("click", ".editBtn", function(articles) {
        var id = $(this).attr("id")
        var comments = [];
        var articleId = [];
        var buttons = [];
        console.log(id)
        // console.log("HELLO")

        $.ajax({
            type: "GET",
            url: "/find/" + id,
            success: function(data) {
                // console.log(data)


                for (var i = 0; i < data.length; i++) {
                    comments.push(data[i].body)
                    articleId.push(data[i]._id)
                    var a = $("<button>");
                    // Adding a class of celeb to our button
                    a.addClass("comment");
                    // Adding a data-attribute
                    a.attr("data-ID", articleId[i]);
                    // Providing the initial button text
                    a.text(comments[i]);
                    buttons.push(a)
                }


                // comments.join('\r\n')

                BootstrapDialog.show({
                    title: 'Comment(s)',
                    message: buttons,
                    buttons: [{
                        label: "EDIT?(COMINGSOON)",
                        action: function(dialogItself) {
                            dialogItself.close();
                        }
                    }]
                });


                // Fill the inputs with the data that the ajax call collected
                // $("#note").val(data.note);
                // $("#title").val(data.title);
                // Make the #actionbutton an update button, so user can
                // Update the note s/he chooses
                // $("#actionbutton").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
            }
        });
        // if there are =2 or more comments then show bootstrap dialog as folows

        //     if there is one comment show this




    });

    $(document).on("click", ".deleteBtn", function() {
        var eyeD = $(this).attr("id")
        var comId = $(this).attr("data-name")


        BootstrapDialog.confirm({
            title: 'WARNING',
            message: 'Warning! Delete this comment?',
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            draggable: true, // <-- Default value is false
            btnCancelLabel: 'Do not drop it!', // <-- Default value is 'Cancel',
            btnOKLabel: 'Drop it!', // <-- Default value is 'OK',
            btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
            callback: function(result) {
                // result will be true if button was click, while it will be false if users close the dialog directly.
                if (result) {
                    alert('Comment Deleted.');
                    $.ajax({
                        method: "DELETE",
                        url: "/comments/delete/" + comId + "/" + eyeD
                    }).done(function(data) {
                        console.log(data)

                    })
                } else {
                    alert('Nope.');
                }
            }
        });
    });

})