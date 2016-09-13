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
var clauseTitleFound = "";


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

function getBooksData1(key) {
arr0 = [];
arr1 = [];
var data = '{"clauses":[' +
'{"clauseNumber":"1.1","clauseTitle":"CT1111"},' +
'{"clauseNumber":"1.2","clauseTitle":"CT122222"},' +
'{"clauseNumber":"1.3","clauseTitle":"CT13333"}]}';
var jsonData = JSON.parse(data);

for (var i = 0; i < jsonData.clauses.length; i++) {
    var clause = jsonData.clauses[i];
    //arr0.push({ "clauseNumber":clause.clauseNumber });
    //arr1.push({ "clauseTitle":clause.clauseTitle });
    arr0.push( clause.clauseNumber );
    arr1.push( clause.clauseTitle );
    console.log("arr0 = " + arr0[i] + "; arr1 = " + arr0[i]); 


    }
    
var iFound = arr0.indexOf(key);
var clauseTitleFound = arr1[iFound];
console.log("iFound = " + iFound + "; clauseTitleFound = " + clauseTitleFound); 
}

var intents = new builder.IntentDialog();  
bot.dialog('/', intents);  
intents.matches(/^Hi/i, [  
    function(session) {  
        builder.Prompts.text(session, 'Books on which topic do you want?');  
    },  
    function(session, results) {  
        session.send('Books for topic - %s - are available. Submit "info" to choose.', results.response);  
        var b0 = []; 
        var b1 = []; 
        getBooksData1(results.response);  
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
        //var book = arr0[results.response.entity - 1];  
        //if (book.saleability == 'FOR_SALE') {  
            //session.send('Title:' + book.title + " Price:" + book.price.amount + " " + book.price.currencyCode);  
        //} else {  
           // session.send('Title:' + book.title + " Price: NOT FOR SALE");  
       // } 
        console.log("clauseTitleFound = " + clauseTitleFound); 
        session.send('clause title is:' + clauseTitleFound);  
    }  
]);  
intents.onDefault(builder.DialogAction.send('Hi there! How can I help you today?'));  

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
