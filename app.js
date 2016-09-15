var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');

const scriptRulesClauses = require('./scriptClauses.json');
const scriptRulesClausesPlant = require('./scriptClausesPlant.json');
const scriptRulesIndex = require('./scriptIndex.json');
const scriptRulesIndexPlant = require('./scriptIndexPlant.json');

var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var iFound = 0;
var clauseTitleFound = [];

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.port = process.env.port || process.env.PORT || 80;
server.host = process.env.port || '0.0.0.0';
server.listen(server.port,server.host, function () {
       console.log('%s FDICbotmbf listening to %s', server.name, server.url);
});

function getData(session,key) {
clauseTitleFound = [];

var data = "";
if (session.userData.name == 'c')
        if (session.userData.type == 'n')
            {data = scriptRulesClauses;}
            else {data = scriptRulesIndex;}
            
if (session.userData.name == 'p')
        if (session.userData.type == 'n')
            {data = scriptRulesClausesPlant;}
            else {data = scriptRulesIndexPlant;}


var clausesAry = [];
for (var i in data)
    {clausesAry.push([i, data [i]]);}
var iFound = 0;
for (var i = 0; i < clausesAry.length; i++) {
  if (clausesAry[i][0] == key.toUpperCase()) {
    iFound = i;
    break;}
}

console.log("key,clauseTitleFound[0] = " + key +" , " + clauseTitleFound[0]);

if (iFound != 0){clauseTitleFound[0] = clausesAry[iFound][1];}
     else {clauseTitleFound[0] = 'notFound';}
console.log("iFound = " + iFound + "; clauseTitleFound = " + clauseTitleFound); 
     }

//////////////////intents

var intents = new builder.IntentDialog();  

bot.dialog('/', intents); 

intents.onDefault(builder.DialogAction.send('Please say "hi" to start.')); 

intents.matches(/^quit/i, [function (session) {session.endDialog('OK... Goodbye');}]);

intents.matches(/^hi/i, [
//bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("FIDIC Contracts bot")
            .text("Search the contracts and access guidance.")
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Start a search anytime.");
        //session.beginDialog('/select');
        session.beginDialog('/help');
    },
    function (session, results) {
        session.endDialog();
        session.beginDialog('/profile');
        //session.send('Say "search" to start searching.');
        //session.cancelDialog('/select'); //get oops
    }
]);


bot.dialog('/help', [function (session) {session.endDialog("Prompts:\n\n* select - Select or change a search type. \n* search - Search contract.\n* help - Display prompts.\n\nSearches:\n\n* contracts: Construction or Plant & Design-Build. \n* search types: by clause number or by keyword in index.");}]);

intents.matches(/^help/i, [function (session) {session.endDialog("Prompts:\n\n* select - Select or change a search type. \n* search - Search contract.\n* help - Display prompts.\n\nSearches:\n\n* contracts: Construction or Plant & Design-Build. \n* search types: by clause number or by keyword in index.");}]);

intents.matches(/^search/i, [
    function (session) {session.beginDialog('/profile');},
]);

intents.matches(/^select/i, [
    function (session) {session.beginDialog('/profile');},
]);

intents.matches(/^y/i, [
    function (session) {session.beginDialog('/profile');},
]);

/////////////////profile

bot.dialog('/profile', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.endDialog('/select');
            //session.beginDialog('Say "select" to choose contract.');
        } else {next();}
    },
    //function (session, results) {session.send('Contract selected: %s. Say "search" to search; say "change" to change contract.', session.userData.name);}
    function (session, results) {session.beginDialog('/no_change');}
]);

/////////////////profile

bot.dialog('/select', [ //not got store search variables
    function (session) {
        builder.Prompts.text(session, 'Contract: Construction (say "c"), Plant (say "p")?');
    },
    function (session, results) {
        session.userData.name = results.response;
        //session.beginDialog('/type');
        session.endDialog('/type');
    }
]);

bot.dialog('/no_change', [ //got store search variables
    function (session) {
        builder.Prompts.text(session, 'Contract: ' + session.userData.name + ', Search type: ' + session.userData.type + '.  Same search (say "s"). Or change: Construction (say "c"), Plant (say "p")?');
    },
    function (session, results) {
        if (results.response == 'c' || results.response == 'p')
            {session.userData.name = results.response; session.replaceDialog('/type');}
            else
            {session.beginDialog('/search');}
    }
]);

bot.dialog('/type', [
//intents.matches(/^select/i, [
    function (session) {
        builder.Prompts.text(session, 'Search in: clause numbers (say "n") or index (say "i")?');
    },
    function (session, results) {
        session.userData.type = results.response;
        //session.endDialog();
        session.beginDialog('/search');
    }
]);

bot.dialog('/search', [
    function(session, results) {  
        if (session.userData.type == 'n'){builder.Prompts.text(session, 'Clause number?');} 
           else {builder.Prompts.text(session, 'Keyword?');} 
           }, 
    
    function(session, results) {  
        getData(session,results.response); 
        var book = clauseTitleFound[0];
        console.log(book);
        if (book == "notFound")
                {
                if (session.userData.type == 'n'){session.send('Clause number not in contract.');}
                    else {session.send('Keyword not in index.');}
                }
                else
                {
                if (session.userData.type == 'n'){session.send(book);}
                    else {session.send('Keyword is in index, see clause: ' + book);}
                } 
        session.endDialog('Say "y" to search again or "n" to quit.'); 
            }
        
]); 




server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
