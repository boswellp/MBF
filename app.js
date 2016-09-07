//Add your requirements
var restify = require('restify');
var builder = require('botbuilder');

//var appId = process.env.MY_APP_ID || "Missing your app ID";
//var appSecret = process.env.MY_APP_SECRET || "Missing your app secret";
var appId;
var appPassword;

// Create bot and add dialogs
var bot = new builder.BotConnectorBot
({appId: "c6076e92-cae8-4b0b-83da-565b83d5c8c6", appPassword: "ReY4ExyPZmPsPdqqA3DdGU8"});
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
