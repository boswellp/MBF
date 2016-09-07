//Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

var appId = process.env.MY_APP_ID || "Missing your app ID";
var appSecret = process.env.MY_APP_SECRET || "Missing your app secret";

//password : HRGGD3coOVosqQJ38DV0EQE
//var appId = "8d44e30d-f422-48fa-ac8f-88270b448699";
//var appSecret = "o9YT-dmN-k8.cwA.fqA.BH8c24LSoFQ8_vTXnft9RYpgmoLnhEIjcu9gBSzW59Y";

// Create bot and add dialogs
var bot = new builder.BotConnectorBot
({appId: "8d44e30d-f422-48fa-ac8f-88270b448699", appSecret: "HRGGD3coOVosqQJ38DV0EQE"});
bot.add('/', new builder.SimpleDialog( function (session) {
session.send('Hello World');
}));

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3000, function () {
console.log('%s listening to %s', server.name, server.url);
});

server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));
