var restify = require('restify');
var https = require('https');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var arr = []; 


var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.port = process.env.port || process.env.PORT || 80;
server.host = process.env.port || '0.0.0.0';
server.listen(server.port,server.host, function () {
       console.log('%s FDICbotmbf listening to %s', server.name, server.url);
});



function getBooksData(key) {  
    https.get("https://www.googleapis.com/books/v1/volumes?q=" + key + "&maxResults=5", function(res) {  
        var d = '';  
        var i;  
        res.on('data', function(chunk) {  
            d += chunk;  
        });  
        res.on('end', function() {  
            var e = JSON.parse(d);  
            for (i = 0; i < e.items.length; i++) {  
                console.log(i + 1 + ":" + e.items[i].volumeInfo.title);  
                bot.dialog ( '/', function (session) {session.send ( 'xxxxxxxx'); } );
            }  
        });  
    });  
}  
var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
        builder.Prompts.text(session, 'Hey, I am a BookBot. Welcome to Book Searching through Chat.To start, which books you would like to search?');  
    },  
    function(session, results) {  
        session.send('Here are books for topic - %s.', results.response);  
        getBooksData(results.response);  
    }  
]);  
intents.onDefault(builder.DialogAction.send('How can I help you?')); 

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
