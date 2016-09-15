
var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');

const _ = require('lodash');
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
  
session.userData.result = '';
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

if (iFound != 0){clauseTitleFound[0] = clausesAry[iFound][1];}
     else {clauseTitleFound[0] = 'notFound';}
     }
     
     
var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
        builder.Prompts.text(session, 'Books on which topic do you want?');  
    },  
    function(session, results) {  
        session.send('Books for topic - %s - are available. Submit "info" to choose.', results.response);  
        var b = [];  
        getBooksData(results.response);  
    },  
    function(session) {  
        builder.Prompts.text(session, 'which books');  
    }  
]);  
intents.matches(/^info?/i, [  
    function(session) {  
        builder.Prompts.choice(session, "Which book's info you need?", "1|2|3|4|5");  
    },  
    function(session, results) {  
        var book = arr[results.response.entity - 1];  
        if (book.saleability == 'FOR_SALE') {  
            session.send('Title:' + book.title + " Price:" + book.price.amount + " " + book.price.currencyCode);  
        } else {  
            session.send('Title:' + book.title + " Price: NOT FOR SALE");  
        }  
        session.send('Description:' + book.description);  
    }  
]);  
intents.onDefault(builder.DialogAction.send('Hi there! How can I help you today?'));  

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
