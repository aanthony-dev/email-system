/**
 * Contains functions relating to help buttons across the site.
 *
 * Author: Angus Anthony (A00429430)
 * Author: Celine Ayoub (A00423097)
 */

/****************************COMPOSE HELP************************************/

/**
 * Opens an alert containing help information
 * for the to section of the compose screen.
 * Return: N/A
 */
function toHelp() {
    alert("1) Who do you need to send an email to?\n\n" +
          "2) How many people do you need to send this email to?");
}

/**
 * Opens an alert containing help information
 * for the cc section of the compose screen.
 * Return: N/A
 */
function ccHelp() {
    alert("1) Is there anyone you need to copy on this email?");
}

/**
 * Opens an alert containing help information
 * for the subject section of the compose screen.
 * Return: N/A
 */
function sbHelp() {
    alert("1) What is this email about?\n\n" +
          "2) Why are you sending this email?");
}

/**
 * Opens an alert containing help information
 * for the body section of the compose screen.
 * Return: N/A
 */
function bdHelp() {
    alert("1) How should you greet the person you are emailing?\n\n" +
          "2) Do you need to ask any questions?\n\n" +
          "3) Does the person you are emailing know any " +
          "information about you?");
}

/****************************HELP BUTTONS************************************/
/**
 * This function sends an alert to explain what the compose page is for
 * when the "help" button is pressed on that page
 * Return: N/A
 */
function getHelpCompose() {
    alert("The purpose of this page is to write an email " +
          "and send it to someone.");
}

/**
 * This function sends an alert to explain what the sent items page is for
 * when the "help" button is pressed on that page
 * Return: N/A
 */
function getHelpOutbox() {
    alert("The purpose of this page is to show you emails" +
          " you have sent to people.");
}

/**
 * This function sends an alert to explain what the inbox page is for
 * when the "help" button is pressed on that page
 * Return: N/A
 */
function getHelpIndex() {
    alert("The purpose of this page is to show you emails " +
          "you have gotten from others.");
}

/**
 * This function sends an alert to explain what the inbox viewing page is for
 * when the "help" button is pressed on that page
 * Return: N/A
 */
function getHelpInboxItem() {
    alert("The purpose of this page is to view the " +
          "information in an email you received.");
}

/**
 * This function sends an alert to explain what the outbox viewing page is for
 * when the "help" button is pressed on that page
 * Return: N/A
 */
function getHelpOutboxItem() {
    alert("The purpose of this page is to view the " +
          "information in an email you sent.");
}
