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
            else if (session.userData.type == 'i'){data = scriptRulesIndex;}
            else {data = ""}
            
if (session.userData.name == 'p')
        if (session.userData.type == 'n')
            {data = scriptRulesClausesPlant;}
            else if (session.userData.type == 'i'){data = scriptRulesIndexPlant;}
            else {data = ""}


var clausesAry = [];
for (var i in data)
    {clausesAry.push([i, data [i]]);}
var iFound = 0;
for (var i = 0; i < clausesAry.length; i++) {
  if (clausesAry[i][0] == key) {
    iFound = i;
    break;}
}

if (iFound != 0){clauseTitleFound[0] = clausesAry[iFound][1];}
     else {clauseTitleFound[0] = 'Clause not in contract.';}
//console.log("iFound = " + iFound + "; clauseTitleFound = " + clauseTitleFound); 
     }

var intents = new builder.IntentDialog();  

bot.dialog('/', intents); 

intents.onDefault(builder.DialogAction.send('Say "hi" to start.'));

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
        session.beginDialog('/select');
    },
    function (session, results) {
        session.beginDialog('/help');
        session.send('Say "search" to start searching.');
    }
]);


bot.dialog('/help', [function (session) {session.endDialog("Prompts:\n\n* select - Select a contract. \n* search - Search contract.\n* change - Change contract.\n* help - Display prompts.");}]);

bot.dialog('/profile', [
    function (session, args, next) {
        if (!session.userData.name) {
            //session.beginDialog('/select');
            session.beginDialog('Say "select" to choose contract.');
        } else {next();}
    },
    function (session, results) {session.send('Contract selected: %s. Say "search" to search; say "change" to change contract.', session.userData.name);}
]);

bot.dialog('/select', [
//intents.matches(/^select/i, [
    function (session) {
        builder.Prompts.text(session, 'Contract: Construction (say "c") or Plant (say "p")?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.beginDialog('/type');
    }
]);

bot.dialog('/type', [
//intents.matches(/^select/i, [
    function (session) {
        builder.Prompts.text(session, 'Search in: clause numbers (say "n") or index (say "i")?');
    },
    function (session, results) {
        session.userData.type = results.response;
        session.endDialog();
    }
]);

intents.matches(/^help/i, [function (session) {session.endDialog("Prompts:\n\n* select - Select a contract. \n* search - Search a contract.\n* change - Change contract.\n* help - Display prompts.");}]);

intents.matches(/^search/i, [
    function(session, results) {  
        if (session.userData.type == 'n'){builder.Prompts.text(session, 'Clause number?');} 
           else {builder.Prompts.text(session, 'Keyword?');} 
           }, 
    
    function(session, results) {  
        getData(session,results.response); 
        var book = clauseTitleFound[0];
        console.log(book);
        if (book == ""){session.send('Clause not in contract or keyword not in index.');}
            else{
              if (session.userData.type == 'n'){session.send(book);}
                 else {session.send('Keyword is in index, see clause: ' + book);}} 
            //session.send('\nSay "search" to search again in the same way. Say "change" to change the contract and/or search type.');
            },
            
    function (session, results) {
        session.send("Search again ....");
        session.beginDialog('/help');}
        
        
]); 

intents.matches(/^change/i, [
    function (session) {builder.Prompts.text(session, 'Contract: Construction (say "c") or Plant (say "p")?');},
    function (session, results) {
        session.userData.name = results.response;
        session.send('Say "type" to choose search type.');
    }
]);

intents.matches(/^select/i, [
    function (session) {builder.Prompts.text(session, 'Contract: Construction (say "c") or Plant (say "p")?');},
    function (session, results) {
        session.userData.name = results.response;
        //builder.Prompts.text(session, 'Say "type" to choose search type.');
        session.send('Say "type" to choose search type.');
    }
]);

intents.matches(/^type/i, [
    function (session) {builder.Prompts.text(session, 'Search in: clause numbers (say "n") or index (say "i")?');},
    function (session, results) {
        session.userData.type = results.response;
        //session.endDialog();
        session.send('Say "search".');
    }
]);
  
server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
