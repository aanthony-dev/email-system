/**
 * Contains functions relating to the various actions involving
 * emails for the student side of the system.
 *
 * Author: Angus Anthony (A00429430)
 * Author: Celine Ayoub (A00423097)
 */

var SERVER_URL = "";

/**
 * Makes server request for emails relevant to the page the user is on
 * and displays them.
 * This is done by adding HTMl within the div with id="email-container".
 * Param: page - determines what array of emails will be requested.
 * Return: N/A
 */
function loadMail(page) {
    var link;
    var emailInfo = { "page": page };

    switch (page) {
        case "index.html":
            link = "goToInboxItem";
            break;
        case "outbox.html":
            link = "goToOutboxItem";
            break;
    }

    //server request
    $.post(SERVER_URL + '/loadMail', emailInfo, loadMailCallback)
     .fail(errorCallback);

    //create the framework to display the emails
    function loadMailCallback(data) {
        var i;
        for (i = data.length - 1; i >= 0; i--) {
            var x = data[i]._id;
            //if email has not been read: make it bold
            if (data[i].rs == 0) {
                document.getElementById("email-container").innerHTML +=
                    '<div class="single-email-container unread" id="email' +
                    i + '" onclick="' + link + '(' + "'" + x +
                    "'" + ')"></div>' + '<div class="email-check"> ' +
                    '<input type="checkbox"> </div>' +
                    '<div class="email-del" id="delete' + x +
                    '" onclick="deleteEmail(' + "'" + x + "'" +
                    ', \'' + page + '\')"' + '">X</div>';
            }
            //else email has been read
            else {
                document.getElementById("email-container").innerHTML +=
                    '<div class="single-email-container" id="email' +
                    i + '" onclick="' + link + '(' + "'" + x +
                    "'" + ')"></div>' + '<div class="email-check"> ' +
                    '<input type="checkbox"> </div>' +
                    '<div class="email-del" id="delete' + x +
                    '" onclick="deleteEmail(' + "'" + x + "'" +
                    ', \'' + page + '\')"' + '">X</div>';
            }

            var currentEmail = "email" + i;
            //create the elements to display each email's information
            document.getElementById(currentEmail).innerHTML +=
                '<div class="email-add" id="address' + x + '"></div>' +
                '<div class="email-sub" id="subject' + x + '"></div>';

            var address = "address" + x;
            var subject = "subject" + x;
            //fill in the elements with the correct information
            if (page === "index.html") {
                document.getElementById(address).innerHTML = data[i].fr;
                document.getElementById(subject).innerHTML = data[i].sb;
            } else {
                document.getElementById(address).innerHTML = data[i].to;
                document.getElementById(subject).innerHTML = data[i].sb;
            }
        }
    }
}

/**
 * Makes server request for the email selected by the user and displays
 * the contents of the email.
 * This is done by adding HTMl within several divs.
 * Once an email has been loaded, it is considered to have been read
 * and will no longer appear in bold text.
 * Param: page - used to determine what database collection is queried.
 * Return: N/A
 */
function loadEmail(page) {
    //get unique email id that was previously saved in local storage
    var id = JSON.parse(localStorage.getItem("emailID"));
    var emailInfo = { "_id": id, "page": page };

    //server request
    $.post(SERVER_URL + '/loadEmail', emailInfo, loadEmailCallback)
     .fail(errorCallback);

    function loadEmailCallback(data) {
        //if loading an inbox item: display "fr" element of email
        if (page === "inboxItem.html") {
            document.getElementById("from").innerHTML +=
                '<input class="form-control" type="email" value="' +
                data.fr + '" readonly/>';
        }
        //else display "to" element of email
        else {
            document.getElementById("to").innerHTML +=
                '<input class="form-control" type="email" value="' +
                data.to + '" readonly/>';
        }

        //display "cc" element of email
        document.getElementById("cc").innerHTML +=
            '<input class="form-control" type="email" value="' +
            data.cc + '" readonly/>';

        //display "sb" element of email
        document.getElementById("sb").innerHTML +=
            '<input class="form-control" type="text" value="' +
            data.sb + '" readonly/>';

        //display "bd" element of email
        document.getElementById("bd").innerHTML +=
            data.bd;
    }
}

/**
 * Makes server request to check if either the outbox of the sender is full
 * or the inbox of the recipient is full.
 * Adds preloaded contact names and addresses to the compose screen
 * dropdowns.
 * Param: page - used to determine what database collections to query.
 * Return: N/A
 */
function loadCompose(page) {
    var emailInfo = { "page": page };

    document.getElementById("to-form").innerHTML +=
        '<input class="input-group-text dropdown" list="contacts" id="to">' +
        '<datalist id="contacts">' +
        '<option value="Terence Goldsmith (Terence.Goldsmith@smu.ca)">' +
        '<option value="Terry (Terry@humanisticsystems.ca)">' +
        '<option value="Charli (Charli@autismns.ca)">' +
        '<option value="Chrystal (Chrystal@autismns.ca)">' +
        '</datalist>';

    document.getElementById("cc-form").innerHTML +=
        '<input class="input-group-text dropdown" list="contacts" id="cc">' +
        '<datalist id="contacts">' +
        '<option value="Terence Goldsmith (Terence.Goldsmith@smu.ca)">' +
        '<option value="Terry (Terry@humanisticsystems.ca)">' +
        '<option value="Charli (Charli@autismns.ca)">' +
        '<option value="Chrystal (Chrystal@autismns.ca)">' +
        '</datalist>';

    //server request
    $.post(SERVER_URL + '/checkNumEmails', emailInfo, checkCallback)
     .fail(errorCallback);

    function checkCallback(data) {
        console.log(data);
        if (data === "inbox") {
            alert('Recipient\'s inbox is full.');
            window.history.back();
        } else if (data === "outbox") {
            alert('Your sent items is full.');
            window.history.back();
        }
    }
}

/**
 * Makes server request to remove an email from the database and reloads
 * the current page.
 * Param: index - the unique id connected to the email being requested.
 * Param: page - determines what database collection is queried.
 * Return: N/A
 */
function deleteEmail(index, page) {
    var emailInfo = { "_id": index, "page": page };

    if (window.confirm("Are you sure you want to delete this email?")) {
        //server request
        $.post(SERVER_URL + '/deleteEmail', emailInfo).fail(errorCallback);
    }
    //reload the page to show the changes
    location.reload();
}

/**
 * Gets the values from each field in the compose page and converts
 * them to a single JSON object to be sent.
 * It then makes a server request to save the email to the relevant inbox
 * and outbox collections.
 * Param: page - used to determine what collections the email is saved to.
 * Return: N/A
 */
function send(page) {
    //ask the user to confirm sending their email
    var confirmSend = confirm(
        "1) Is everything spelled correctly?\n\n" +
        "2) Did you use full sentences?\n\n" +
        "3) Is the email addressed to the correct person?\n\n" +
        "4) Did you sign your name at the end of the email?\n"
    );
    //if the user wants to send the email
    if (confirmSend) {
        //prepare all values to create the email
        var to = $("#to").val();
        var fr = "student@tbd.ca";
        var cc = $("#cc").val();
        var sb = $("#sb").val();
        var bd = $("#bd").val();
        var rs = 0; //read status, 0 has not been read, 1 has been read

        var emailInfo = {
            "page": page,
            "to": to,
            "fr": fr,
            "cc": cc,
            "sb": sb,
            "bd": bd,
            "rs": rs
        };

        //server request
        $.post(SERVER_URL + '/sendEmail', emailInfo, sendCallback)
         .fail(errorCallback);

        function sendCallback(data) {
            //return to last page after sending
            window.history.back();
        }
    }
}

/**
 * Handles any errors relating to server requests should they arise.
 * Return: N/A
 */
function errorCallback(err) {
    console.log(err.responseText);
}
