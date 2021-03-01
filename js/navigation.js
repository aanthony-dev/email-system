/**
 * Contains functions relating to navigation between pages on
 * the site.
 *
 * Author: Angus Anthony (A00429430)
 * Author: Celine Ayoub (A00423097)
 */

/****************************GENERAL NAVIGATION******************************/

/**
 * Takes the user to the previous page they were on.
 * Return: N/A
 */
function goBack() {
    window.history.back();
}

/**
 * Prompts the user that they are leaving a page.
 * If accepted, they are taken to the previous page they were on.
 * Return: N/A
 */
function cancel() {
    if (window.confirm("Are you sure you want to cancel?")) {
        window.history.back();
    }
}

/****************************STUDENT NAVIGATION******************************/

/**
 * Takes the user to the Compose page of the email system.
 * Return: N/A
 */
function goToCompose() {
    window.location.href = "compose.html";
}

/**
 * Takes the user to the Inbox page of the email system.
 * Return: N/A
 */
function goToInbox() {
    window.location.href = "index.html";
}

/**
 * Takes the user to the Outbox page of the email system.
 * Return: N/A
 */
function goToOutbox() {
    window.location.href = "outbox.html";
}

/**
 * Takes the user to an email that is in their inbox.
 * Saves the ID of the selected email in local storage.
 * Param: index - the array index of the email clicked on by the user.
 * Return: N/A
 */
function goToInboxItem(index) {
    try {
        localStorage.setItem("emailID", JSON.stringify(index));
    } catch (localStorageError) {
        alert("Error Saving ID");
    }
    window.location.href = "inboxItem.html";
}

/**
 * Takes the user to an email that is in their outbox.
 * Saves the ID of the selected email in local storage.
 * Param: index - the array index of the email clicked on by the user.
 * Return: N/A
 */
function goToOutboxItem(index) {
    try {
        localStorage.setItem("emailID", JSON.stringify(index));
    } catch (localStorageError) {
        alert("Error Saving ID");
    }
    window.location.href = "outboxItem.html";
}

/****************************ADMIN NAVIGATION********************************/

/**
 * Takes the user to the Compose page of the email system.
 * Return: N/A
 */
function goToComposeA() {
    window.location.href = "composeA.html";
}

/**
 * Takes the user to the Inbox page of the email system.
 * Return: N/A
 */
function goToInboxA() {
    window.location.href = "indexA.html";
}

/**
 * Takes the user to the Outbox page of the email system.
 * Return: N/A
 */
function goToOutboxA() {
    window.location.href = "outboxA.html";
}

/**
 * Takes the user to an email that is in their inbox.
 * Saves the ID of the selected email in local storage.
 * Param: index - the array index of the email clicked on by the user.
 * Return: N/A
 */
function goToInboxItemA(index) {
    try {
        localStorage.setItem("emailID", JSON.stringify(index));
    } catch (localStorageError) {
        alert("Error Saving ID");
    }
    window.location.href = "inboxItemA.html";
}

/**
 * Takes the user to an email that is in their outbox.
 * Saves the ID of the selected email in local storage.
 * Param: index - the array index of the email clicked on by the user.
 * Return: N/A
 */
function goToOutboxItemA(index) {
    try {
        localStorage.setItem("emailID", JSON.stringify(index));
    } catch (localStorageError) {
        alert("Error Saving ID");
    }
    window.location.href = "outboxItemA.html";
}
