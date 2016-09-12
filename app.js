var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);


var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.port = process.env.port || process.env.PORT || 80;
server.host = process.env.port || '0.0.0.0';
server.listen(server.port,server.host, function () {
       console.log('%s FDICbotmbf listening to %s', server.name, server.url);
});

//bot.dialog('/', function (session) {
//    session.send("Hello. We have only recently (10 September 2016) started development of the FIDICbot for the Microsoft platform for integration with Skype and hopefully KiK. Meanwhile, a fully developed FIDICbot for the FIDIC contracts runs @FIDICbot on Telegram, Messenger, LINE, SMS (+41 79 807 1730) and web (fidic.pw). For these platforms the bot uses Smooch as the integrator. Please check back later or use another messenger service.");
//});

bot.dialog('/', [  
    function(session)  
    {  
        builder.Prompts.text(session, 'Hello. What is your name?');  
    },  
    function(session, results) {  
        session.send('Hello %s! How are you today?', results.response);  
    }  
]);

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
