var builder = require('botbuilder');  
var connector = new builder.ConsoleConnector().listen();  
var bot = new builder.UniversalBot(connector);  
bot.dialog('/', function(session)  
{  
    session.send("Hi there, How can I help you?");  
});
