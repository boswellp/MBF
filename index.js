// Copyright (c) Bricad Associates, 9 March 2020

/*//express for viber
const express = require('express')
const app = express()
const port = 3000
var viber = require('botbuilder-viber')
var viberOptions = {
  Token: process.env.VIBER_TOKEN,
  Name: 'ViberBotName',  
  AvatarUrl: 'http://url.to/pngfile'
}
var viberChannel = new viber.ViberEnabledConnector(viberOptions)
const winston = require('winston');
/////////*/

const path = require('path');
const restify = require('restify');

const { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } = require('botbuilder');
const { QnAMaker } = require('botbuilder-ai');

const { QnAMultiturnBot } = require('./bots/QnAMultiturnBot');
const { RootDialog } = require('./dialogs/rootDialog');

const { ActivityTypes } = require('botbuilder-core');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });


const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function() {
    console.log(`\n${ server.name } listening to ${ server.url }.`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});


const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${ error }`);
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

const memoryStorage = new MemoryStorage();

const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

var endpointHostName = process.env.QnAEndpointHostName;
if (!endpointHostName.startsWith('https://')) {
    endpointHostName = 'https://' + endpointHostName;
}

if (!endpointHostName.endsWith('/qnamaker')) {
    endpointHostName = endpointHostName + '/qnamaker';
}

const qnaService = new QnAMaker({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    endpointKey: process.env.QnAEndpointKey,
    host: endpointHostName
});


const dialog = new RootDialog(qnaService);
const bot = new QnAMultiturnBot(conversationState, userState, dialog);

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        // Route the message to the bot's main handler.
        await bot.run(turnContext);
    });
});
