var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');

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

function getData(key) {
clauseTitleFound = [];
var data = {"0":"","1.1":"CT1111","1.2":"CT122222","1.3":"CT13333"};
var clausesAry = [];
for (var i in data)
    {clausesAry.push([i, data [i]]);
    console.log("clausesAry = " + clausesAry[0][i]);}
var iFound = 0;
for (var i = 0; i < clausesAry.length; i++) {
  if (clausesAry[i][0] == key) {
    iFound = i;
    break;}
}

if (iFound != 0){clauseTitleFound[0] = clausesAry[iFound][1];}
     else {clauseTitleFound[0] = clausesAry[0][1];}
console.log("iFound = " + iFound + "; clauseTitleFound = " + clauseTitleFound); 
}


bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("FIDIC Contracts bot")
            .text("Search the contracts and access guidance.")
            .images([
                 builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Start a search anytime.");
        session.beginDialog('/select');
        session.beginDialog('/contract');
    },
  

    function (session, results) {
        session.send("OK... See you later");
    }
]);

//bot.dialog('/help', [function (session) {session.endDialog("Prompts available anytime:\n\n* select - Select a contract. \n* start - Start a search.\n* end - End this conversation.\n* help - Display these prompts.");}]);

bot.dialog('/profile', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/contract');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/select', [
    function (session) {
        builder.Prompts.text(session, 'Construction Contract (say "c") or Plant Contract (say "p")?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();   //back to root?
        //session.beginDialog('/start');
    }
]);


var intents = new builder.IntentDialog();  
bot.dialog('/contract', intents); 

//bot.endConversationAction('end', 'Goodbye', { matches: /^end/i });
//bot.beginDialogAction('help', '/help', { matches: /^help/i });

//intents.matches(/^start/i, [function (session) {session.endDialog("Search FIDIC contracts. Prompts available anytime:\n\n* start \n* end \n* help ");}]);

//intents.matches(/^help/i, [function (session) {session.endDialog("Prompts available anytime:\n\n* start - Start a search.\n* end - End this conversation.\n* help - Display these prompts."); }]);

intents.matches(/^start/i, [ 

    function (session) {
        builder.Prompts.text(session, "Search Construction (say c) or Plant (say p)?");
                     },
    
    function(session, results) {  
        builder.Prompts.text(session, 'Clause number?');  
                      }, 
    
    function(session, results) {  
        getData(results.response); 
        var book = clauseTitleFound[0];
        console.log("clauseTitleFound = " + book);
        if (book == "")
            {session.send('Try again');}
            else
            {session.send('Clause title is :' + book);} 
    }  
  
]);  
  
server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
