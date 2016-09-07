//Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

var appId = process.env.MY_APP_ID || "Missing your app ID";
var appSecret = process.env.MY_APP_SECRET || "Missing your app secret";

// Create bot and add dialogs
var bot = new builder.BotConnectorBot
({appId: process.env.MY_APP_ID, appSecret: process.env.MY_APP_SECRET});
bot.add('/', new builder.SimpleDialog( function (session) {
session.send('Hello World');
}));
// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.port = process.env.port || process.env.PORT || 80;
server.host = process.env.port || '0.0.0.0';
server.listen(server.port,server.host, function () {
       console.log('%s FDICbotmbf listening to %s', server.name, server.url);
});

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
    
}));
