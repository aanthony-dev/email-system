/**
 * Connects to Mongo database containing the email collections
 * and has functions to handle requests made to the database.
 * This file is run on the server.
 *
 * Author: Angus Anthony (A00429430)
 * Author: Celine Ayoub (A00423097)
 */

//-------------------------------MONGO--------------------------------------//

var express = require('express');
var mongodb = require('mongodb'), ObjectID = require('mongodb').ObjectID;

//setup mongo database
var username  = '';
var password  = '';
var localHost = '';
var localPort = '';
var database  = ''; //name of database

//create the credentials string used for database connection
var credentialsString = 'mongodb://' + username + ':' + password +
    '@' + localHost + ':' + localPort + '/' + database;

//access the express framework via the variable server
var server = express();

//set port variable
var port = 3009;

//--------------------------------EXPRESS-----------------------------------//

//enable recognition of incoming data as JSON
server.use(express.json());
//incoming values in name:value pairs can be any type (true below)
server.use(express.urlencoded({ extended: true }));

//static assets like javascript and css are served from these folders
server.use('/scripts', express.static(__dirname + '/scripts'));
server.use('/css', express.static(__dirname + '/css'));
// root
server.use(express.static(__dirname));

/**
 * Set up allowance characteristics for cross-origin resource sharing (CORS).
 * Param req - Not used here.
 * Param res - response to HTTP request.
 * Param next - Calls the next Express Framework function set to be executed.
 */
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
server.use(allowCrossDomain);

//-------------------------------FUNCTIONS----------------------------------//

/**
 * Called when a user is in their inbox or outbox.
 * The relevant database collection is loaded and converted to an array.
 * This array of emails is then returned to the client to be displayed.
 */
server.post('/loadMail', loadMailCallback);

function loadMailCallback(req, res) {
    var page = req.body.page;
    var coll;

    //determine email collection to load
    switch(page) {
        case "index.html":
            coll = "inboxS"; break;
        case "outbox.html":
            coll = "outboxS"; break;
        case "indexA.html":
            coll = "inboxA"; break;
        case "outboxA.html":
            coll = "outboxA"; break;
    }

    //get collection as an array
    globalDB.collection(coll).find({}).toArray(function(err, result) {
        if (err == null) {
            //return email array to client
            return res.status(200).send(result);
        } else {
            //throws the error object containing detailed info
            throw err;
        }
    });
}

/**
 * Called when a user has clicked an email to view its contents
 * and are on the inbox item or outbox item page for that email.
 * The database collection containing the email is queried for the
 * selected email.
 * This email is then returned to the client to be displayed.
 * The read status of the email is then updated in the database.
 */
server.post('/loadEmail', loadEmailCallback);

function loadEmailCallback(req, res) {
    var id = new ObjectID(req.body._id); //id of email to find and return
    var page = req.body.page;
    var coll;

    //determine email collection which contains email to load
    switch(page) {
        case "inboxItem.html":
            coll = "inboxS"; break;
        case "outboxItem.html":
            coll = "outboxS"; break;
        case "inboxItemA.html":
            coll = "inboxA"; break;
        case "outboxItemA.html":
            coll = "outboxA"; break;
    }

    //query collection for the email id
    globalDB.collection(coll, function(error, collection) {
        collection.findOne({ _id:id },function(err, result) {
            if (err == null) {
                //return email to client
                return res.status(200).send(result);
            } else { throw err; }
        });
    });

    //update email read status
    var update = { $set: { rs: 1 } };
    globalDB.collection(coll)
            .updateOne({ _id: id }, update, function(err, res) {
        if (err) { throw err; }
    });
}

/**
 * Called when a user has clicked to delete an email
 * in their inbox or outbox.
 * The database collection containing the email is queried for the
 * selected email.
 * This email is then removed from the collection.
 */
server.post('/deleteEmail', deleteEmailCallback);

function deleteEmailCallback(req, res) {
    var id = new ObjectID(req.body._id) //id of email to find and delete
    var page = req.body.page;
    var coll;

    //determine email collection which contains email to delete
    switch(page) {
        case "index.html":
            coll = "inboxS"; break;
        case "outbox.html":
            coll = "outboxS"; break;
        case "indexA.html":
            coll = "inboxA"; break;
        case "outboxA.html":
            coll = "outboxA"; break;
    }

    //query collection for the email id and delete
    globalDB.collection(coll).deleteOne({ _id:id }, true, function(err, res) {
        if (err) { throw err; }
    });
}

/**
 * Called when a user enters their compose page.
 * The inbox collection for the recipient of the email is loaded,
 * along with the outbox collection for the sender of this potential email.
 * Both collections are counted. If either are full (>= maxEmails),
 * this returns to the client which collection is full.
 */
server.post('/checkNumEmails', checkNumEmailsCallback);

function checkNumEmailsCallback(req, res) {
    var maxEmails = 10;
    var page = req.body.page;
    var inboxColl;
    var outboxColl;

    //determine email collections to count
    switch(page) {
        case "compose.html":
            inboxColl = "inboxA"; outboxColl = "outboxS"; break;
        case "composeA.html":
            inboxColl = "inboxS"; outboxColl = "outboxA"; break;
    }

    //check if recipient inbox is full
    globalDB.collection(inboxColl).countDocuments(function(err, inboxCount) {
          if (err == null) {
              //inbox is full
              if (inboxCount >= maxEmails) {
                  return res.status(200).send('inbox');
              }
              else {
                  //check if sender outbox is full
                  globalDB.collection(outboxColl)
                          .countDocuments(function(err, outboxCount) {
                      if (err == null) {
                          //outbox is full
                          if (outboxCount >= maxEmails) {
                              return res.status(200).send('outbox');
                          }
                      } else { throw err; }
                  });
              }
          } else { throw err; }
    });
}

/**
 * Called when a user has clicked the send button while on the compose page.
 * The email data from the client is recieved and prepared to be saved.
 * The email is saved to the inbox collection of the recipient and
 * outbox collection of the sender/user.
 */
server.post('/sendEmail', sendEmailCallback);

function sendEmailCallback(req, res) {
    //prepare email to be saved to database collections
    var emailData = '{"to": "'   + req.body.to +
                    '", "fr": "' + req.body.fr +
                    '", "cc": "' + req.body.cc +
                    '", "sb": "' + req.body.sb +
                    '", "bd": "' + req.body.bd +
                    '", "rs": "' + req.body.rs +
                    '"}';

    var page = req.body.page;
    var inboxColl;
    var outboxColl;

    //determine email collections to insert email into
    switch(page) {
        case "compose.html":
            inboxColl = "inboxA"; outboxColl = "outboxS"; break;
        case "composeA.html":
            inboxColl = "inboxS"; outboxColl = "outboxA"; break;
    }

    //insert email into collections
    globalDB.collection(inboxColl)
            .insertOne(JSON.parse(emailData), function(err) {
                if (err == null) {
                    return res.status(200).send('Email Sent');
                } else { throw err; }
            });
    globalDB.collection(outboxColl)
            .insertOne(JSON.parse(emailData));
}

//-------------------------------MONGO--------------------------------------//

//connect to mongo database
mongodb.connect(credentialsString, getDBReference);

// global variable contains reference to the database
var globalDB;

/**
 * This function is a callback function executed after connecting to
 * the mongo database.
 * This function uses the global system variable "process" which
 * contains info about this Node.js process.
 * Param: err - If an error occured, references error object, otherwise null.
 * Param: ref - If no error occured, contains a valid reference to database.
 * Return: N/A
 */
function getDBReference(err, ref) {
    if (err == null) {
        //when a SIGTERM event occurs: log info; close DB; and close server
        process.on('SIGTERM', function () {
            console.log("Shutting server down.");
            ref.close();
            server.close();
        });

        //initialize reference to the database
        globalDB = ref.db("aw_anthony");

        //start server listening on the port, and log the info
        server.listen(port, function () {
            console.log('Listening on port ' + port);
        });
    } else {
        //throw the object err containing detailed error info
        throw err;
    }
}
