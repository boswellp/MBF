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

//////////////////intents

var intents = new builder.IntentDialog();  

bot.dialog('/', intents); 

intents.onDefault(builder.DialogAction.send('Please say "hi" to start.')); 

intents.matches(/^quit/i, [function (session) {session.endDialog('OK... Goodbye');}]);

intents.matches(/^hi/i, [
    function (session) {
        
        session.userData.result = '';
        var card = new builder.HeroCard(session)
            .title("FIDIC Contracts bot")
            .text("Search FIDIC contracts and guides (tap here for info)")
            .tap(builder.CardAction.openUrl(session, "https://github.com/boswellp/MBF/blob/master/README.md"))

        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.beginDialog('/help');
    },
    function (session, results) {
        session.endDialog();
        session.beginDialog('/profile');
    }
]);


bot.dialog('/help', [function (session) {session.endDialog("Prompts:\n\n* select - Select or change a search type. \n* search - Search contract.\n* help - Display prompts.\n* hi - Start.\n\nSearches:\n\n* contracts: Construction or Plant & Design-Build. \n* search types: by clause number or by keyword in index.");}]);

intents.matches(/^help/i, [function (session) {session.endDialog("Prompts:\n\n* select - Select or change a search type. \n* search - Search contract.\n* help - Display prompts.\n* hi - Start.\n\nSearches:\n\n* contracts: Construction or Plant & Design-Build. \n* search types: by clause number or by keyword in index.");}]);

intents.matches(/^search/i, [function (session) {session.beginDialog('/profile');},
]);

intents.matches(/^select/i, [function (session) {session.beginDialog('/profile');},
]);

intents.matches(/^y/i, [function (session) {session.beginDialog('/profile');},
]);

intents.matches(/^see/i, [function (session) {session.beginDialog('/search');},
]);

intents.matches(/^clause/i, [function (session) {
                var clauseAry = session.userData.result.split(',');
                
                if (clauseAry.length >1)
                    {session.beginDialog('/clause_split');}
                    else
                    {session.beginDialog('/search');}
                }
]);

bot.dialog('/clause_split', [
    function (session) {
        var clauseAry = session.userData.result.split(',')
        var msg = clauseAry[0];
        for (i = 1; i < clauseAry.length; i++)
            {msg = msg + '|' + clauseAry[i];} //these are the clause number, get titles
            
  ///////get clause titles
        msgList = '';
        var fileName = scriptRulesClauses;
        if (session.userData.name == 'p'){var fileName = scriptRulesClausesPlant}
        for (i = 0; i < clauseAry.length; i++) 
                {if (!_.has(fileName, clauseAry[i])){} //leaves out clause if not in clause json
                        else 
                        {
                        var titleClause = scriptRulesClauses[clauseAry[i]];
                        var titleStart = titleClause.indexOf("-",0); //Find clause title
                        var titleEnd = titleClause.indexOf(":",titleStart+1);
                        var title = titleClause.substr(titleStart, titleEnd-titleStart).trim();
                        msgList = msgList + clauseAry[i] + title + '\n';
                        };                 
                };

                                    
/////// //////           
            
        builder.Prompts.choice(session, msgList + "Choose clause: ", msg);
    },
    function (session, results) {
        session.userData.result = results.response.entity;
        session.beginDialog('/search');
    }
]);


/////////////////profile

bot.dialog('/profile', [
    function (session, args, next) {
        if (!session.userData.name) {
        session.endDialog();
        session.beginDialog('/select');
        } else {next();}
    },
   function (session, results) {session.beginDialog('/no_change');}
]);

/////////////////profile

bot.dialog('/select', [ //not got store search variables
    function (session) {
        builder.Prompts.text(session, 'Contract: Construction (say "c"), Plant (say "p")?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.userData.result = '';
        session.endDialog();
        session.beginDialog('/type');
    }
]);

bot.dialog('/no_change', [ //got store search variables
    function (session) {
        builder.Prompts.text(session, 'Contract: ' + session.userData.name + ', Search type: ' + session.userData.type + '.\n Same search (say "s"). Or change: Construction (say "c"), Plant (say "p")?');
    },
    function (session, results) {
        if (results.response == 'c' || results.response == 'p')
            {session.userData.name = results.response; session.replaceDialog('/type');}
            else
            {session.beginDialog('/search');}
    }
]);

bot.dialog('/type', [
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
    function(session, args, next) {
        if (session.userData.result == "")
                {
                if (session.userData.type == 'n')
                        {builder.Prompts.text(session, 'Clause number?');} 
                        else
                        {builder.Prompts.text(session, 'Keyword?');} 
                }
                else
                {
                //builder.Prompts.text(session, 'Say "y" to continue?');
                next();   
                }
               
           }, 
    
    function(session, results) {
        if (session.userData.result == "")
                {var keyIn = results.response;}
                else
                {
                var keyIn = session.userData.result;  //got a clause number from see or clause
                session.userData.type = 'n';
                session.userData.name = 'c';
                }

        getData(session,keyIn); 
        var book = clauseTitleFound[0];
        if (book == "notFound")
                {
                if (session.userData.type == 'n'){session.send('Clause number not in contract.');}
                    else {session.send('Keyword not in index.');}
                session.endDialog('Say "y" to search again or "n" to quit.'); 
                }
                else
                {
                if (session.userData.type == 'n')
                        {
                        var bookAry = book.split('#');
                        session.send(bookAry[0]); 
                        if (bookAry.length == 1)
                                {session.endDialog('Say "y" to search again, "n" to quit.');} 
                                else
                                {session.userData.result = bookAry[1];
                                session.endDialog('Say "clause" to see clause ' + bookAry[1] + ', "y" to search again, "n" to quit.');} 
                            
                        }
                        else 
                        {session.send('Keyword is in index, see clause: ' + book); 
                        session.userData.result = book; 
                        session.endDialog('Say "see" to see clause ' + book + ', "y" to search again, "n" to quit.'); }
                } 
            }
]); 


server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
