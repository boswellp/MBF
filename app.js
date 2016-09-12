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
    https.get("https://www.googleapis.com/books/v1/volumes?q=sharepoint&maxResults=5", function(res) {  
        var d = '';  
        var i;  
        arr = [];  
        res.on('data', function(chunk) {  
            d += chunk;  
        });  
        res.on('end', function() {  
            var e = JSON.parse(d);  
            for (i = 0; i < e.items.length; i++) {  
                console.log(i + 1 + ":" + e.items[i].volumeInfo.title);  
                arr.push({  
                    "description": e.items[i].volumeInfo.description,  
                    "title": e.items[i].volumeInfo.title,  
                    "saleability": e.items[i].saleInfo.saleability,  
                    "price": e.items[i].saleInfo.listPrice  
                });  
            }  
        });  
    });  
}  
var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
        builder.Prompts.text(session, 'I am a BookBot. Welcome to Book Searching through Chat. To start, which books you would like to search?');  
    },  
    function(session, results) {  
        session.send('Here are books for topic - %s.', results.response);  
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
intents.onDefault(builder.DialogAction.send('Hello. How can I help you today?')); 

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
