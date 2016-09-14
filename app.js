var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');


var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var arr0 = [];
var arr1 = [];
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
arr0 = [];
arr1 = [];
clauseTitleFound = [];
var data1 = '{"clauses":[' +
'{"clauseNumber":"1.1","clauseTitle":"CT1111"},' +
'{"clauseNumber":"1.2","clauseTitle":"CT122222"},' +
'{"clauseNumber":"1.3","clauseTitle":"CT13333"}]}';

var data = {"0":"","1.1":"CT1111","1.2":"CT122222","1.3":"CT13333"};

//var jsonData = JSON.parse(data);

//for (var i = 0; i < jsonData.clauses.length; i++) {
//    var clause = jsonData.clauses[i];
//    arr0.push({ "clauseNumber":clause.clauseNumber });
//    arr1.push({ "clauseTitle":clause.clauseTitle });
//    console.log("arr0 = " + arr0[i] + "; arr1 = " + arr0[i]);}
    
var clausesAry = [];
for (var i in data)
    {clausesAry.push([i, data [i]]);
    console.log("clausesAry = " + clausesAry[0][i]);}
    

//iFound = arr0.findIndex(x => x.clauseNumber == key);

var iFound = 0;
for (var i = 0; i < clausesAry.length; i++) {
  if (clausesAry[i][0] == key) {
    iFound = i;
    break;
  }
}

if (iFound != 0){clauseTitleFound[0] = clausesAry[iFound][1];}
     else {clauseTitleFound[0] = clausesAry[0][1];}
//clauseTitleFound[0] = arr1[iFound];
console.log("iFound = " + iFound + "; clauseTitleFound = " + clauseTitleFound); 
}

var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
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
intents.matches(/^info?/i, [  
    function(session) {  
        builder.Prompts.choice(session, "Which book's info you need?", "1|2|3|4|5");  
    },  
    function(session, results) {  
        var book = clauseTitleFound[0];
        console.log("clauseTitleFound = " + book.clauseTitle); 
        session.send('clause title is:' + book.clauseTitle);  
    }  
]);  
intents.onDefault(builder.DialogAction.send('Hi there! How can I help you today?'));  

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
