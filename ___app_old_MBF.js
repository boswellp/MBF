var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');

var _ = require('lodash');
const scriptRulesClauses = require('./scriptClauses.json');
const scriptRulesClausesPlant = require('./scriptClausesPlant.json');
const scriptRulesIndex = require('./scriptIndex.json');
const scriptRulesIndexPlant = require('./scriptIndexPlant.json');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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
            .text("Search FIDIC contracts - currently the Construction and Plant & Design-Build Contracts (tap here for info)")
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

intents.matches(/^search/i, [function (session) {session.userData.result = ""; session.beginDialog('/profile');},
]);

intents.matches(/^select/i, [function (session) {session.userData.result = ""; session.beginDialog('/profile');},
]);

intents.matches(/^y/i, [function (session) {session.userData.result = ""; session.beginDialog('/profile');},
]);

intents.matches(/^see/i, [function (session) {session.beginDialog('/search');},
]);

intents.matches(/^get/i, [function (session) {
                var clauseAry = session.userData.result.split(',');
                
                if (clauseAry.length >1)
                    {session.beginDialog('/get_split');}
                    else
                    {session.beginDialog('/search');}
                }
]);

bot.dialog('/get_split', [
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
                        msgList = msgList + clauseAry[i] + ' ' + title + '\n\n';
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
        builder.Prompts.text(session, 'Contract - | Construction (say "c") | Plant (say "p") |');
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
        var tmpStr0 = 'Stored search settings: Contract: ';
        var tmpStr1 = tmpStr0 + 'c - Construction; Search type: ';
        if (session.userData.name == 'p'){tmpStr1 = tmpStr0 + 'p - Plant; Search type: '}
        var tmpStr2 = tmpStr1 + 'n - clause numbers';
        if (session.userData.type == 'i'){tmpStr2 = tmpStr1 + 'i - index'}
        builder.Prompts.text(session, tmpStr2 + '\n\nUse settings (say "s") | Change: Construction (say "c") | Change: Plant (say "p") |');
    },
    function (session, results) {
        var tmpRes = results.response.trim().toLowerCase();
        console.log('............aaaaaaaaaatmpRes = ' + tmpRes);
        if ((session.userData.name == "") && (tmpRes != 'c' || tmpRes != 'p')){tmpRes = 'c'} //Set default if wrong input and nothing stored
       console.log('............bbbbbbbbbbbtmpRes = ' + tmpRes);
        if (tmpRes == 'c' || tmpRes == 'p') //Store input and continue
            {session.userData.name = tmpRes; session.replaceDialog('/type');}
            else
            {session.beginDialog('/search');} //Use stored
    }
]);

bot.dialog('/type', [
    function (session) {
        builder.Prompts.text(session, 'Search type - | Clause numbers (say "n") | Index (say "i") |');
    },
    function (session, results) {
        var tmpRes = results.response.trim().toLowerCase();
        console.log('............ccccccccccccccctmpRes = ' + tmpRes);
        if (tmpRes != 'n' && tmpRes != 'i'){tmpRes = 'n'} //set default
        console.log('............bbbbbbbbbbbtmpRes = ' + tmpRes);
        session.userData.type = tmpRes;
        //session.endDialog();
        session.beginDialog('/search');
    }
]);

bot.dialog('/search', [
    function(session, args, next) {
        console.log('............111111111111111session.userData.result = ' + session.userData.result);
        if (session.userData.result.trim() == "")
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
                {
                var tmpRes = results.response.trim().toLowerCase();   //Need to clean input
                }
                else
                {
                var tmpRes = session.userData.result;  //got a clause number from see or clause
                session.userData.type = 'n';
                session.userData.name = 'c';
                }

        getData(session,tmpRes);
        session.userData.result = "";
        var book = clauseTitleFound[0];
        if (book == "notFound")
                {
                if (session.userData.type == 'n'){session.send('Clause number not in contract.');}
                    else {session.send('Keyword not in index.');}
                session.endDialog('Say - | "y" to search again | "n" to quit |'); 
                }
                else
                {
                if (session.userData.type == 'n')
                        {
                        var bookAry = book.split('#');
                        
                        var strSend = bookAry[0].replace(/\/\/\//g, "\n\n\n");
                        strSend = strSend.replace(/\n/g, "\n\n");
                        session.send(strSend); 
                        if (bookAry.length == 1)
                                {session.endDialog('Say - | "y" to search again | "n" to quit |');} 
                                else
                                {session.userData.result = bookAry[1];
                                session.endDialog('Say - | "get" to get clause ' + bookAry[1] + ' | "y" to search again | "n" to quit |');} 
                            
                        }
                        else 
                        {session.send('Keyword is in index, see clause: ' + book); 
                        session.userData.result = book; 
                        session.endDialog('Say - | "see" to see clause ' + book + ' | "y" to search again | "n" to quit |'); }
                } 
            }
]); 


server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));