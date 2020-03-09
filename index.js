// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


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



const { BotFrameworkAdapter, MemoryStorage, UserState, ConversationState } = require('botbuilder');

const { ActivityTypes } = require('botbuilder-core');

const { QnAMaker } = require('botbuilder-ai');

const { QnAMultiturnBot } = require('./bots/QnAMultiturnBot');
const { RootDialog } = require('./dialogs/rootDialog');
const { TopLevelDialog } = require('./dialogs/topLevelDialog');


//see sample at https://github.com/BotBuilderCommunity/botbuilder-community-js/tree/master/samples/adapter-twilio-whatsapp
//const { TwilioWhatsAppAdapter } = require('@botbuildercommunity/adapter-twilio-whatsapp');

const { AdaptiveCardsBot } = require('./bots/adaptiveCardsBot');



const { DialogAndWelcomeBot } = require('./bots/dialogAndWelcomeBot');
const { MainDialog } = require('./dialogs/mainDialog');
//const { GreetingDialog } = require('./dialogs/greetingDialog');

const { BookingDialog } = require('./dialogs/bookingDialog');
const BOOKING_DIALOG = 'bookingDialog';

const { QnABot } = require('./bots/QnABot');

const { FlightBookingRecognizer } = require('./dialogs/flightBookingRecognizer');

const { WelcomeBot } = require('./bots/welcomeBot');

// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

/*
//see https://www.npmjs.com/package/@botbuildercommunity/adapter-twilio-whatsapp
const whatsAppAdapter = new TwilioWhatsAppAdapter({
    accountSid: '', // Account SID
    authToken: '', // Auth Token
    phoneNumber: '',// The From parameter consisting of whatsapp: followed by the sending WhatsApp number (using E.164 formatting
    endpointUrl: '' // Endpoint URL you configured in the sandbox, used for validation
});
*/

const memoryStorage = new MemoryStorage();

const userState = new UserState(memoryStorage);
const conversationState = new ConversationState(memoryStorage);

const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: LuisAPIHostName };

const luisRecognizer = new FlightBookingRecognizer(luisConfig);

const qnaService = new QnAMaker({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    endpointKey: process.env.QnAEndpointKey,
    host: process.env.QnAEndpointHostName
});

//const bot = new WelcomeBot(userState);

const dialog = new RootDialog(qnaService,userState); //MULTITURN
const bot = new DialogAndWelcomeBot(conversationState, userState, dialog); //MULTITURN


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
    // Clear out state
    await conversationState.clear(context);
};

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await bot.run(context);
    });
});

/*
//see https://github.com/DreamTeamMobile/botbuilder-viber
bot.connector(viber.ViberChannelId, viberChannel)
app.use('/viber/webhook', viberChannel.listen())
*/

/*
// WhatsApp endpoint for Twilio
//see https://www.npmjs.com/package/@botbuildercommunity/adapter-twilio-whatsapp
server.post('/api/whatsapp/messages', (req, res) => {
    whatsAppAdapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await bot.run(context);
    });
});
*/

