// Copyright (c) Bricad Associates, March 2020

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

//const { WelcomeBot } = require('./bots/welcomeBot');


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


/*
//see https://www.npmjs.com/package/@botbuildercommunity/adapter-twilio-whatsapp
const whatsAppAdapter = new TwilioWhatsAppAdapter({
    accountSid: '', // Account SID
    authToken: '', // Auth Token
    phoneNumber: 'whatsapp:+14155238886',// The From parameter consisting of whatsapp: followed by the sending WhatsApp number (using E.164 formatting
    endpointUrl: 'https://fidicchatbot.herokuapp.com/api/whatsapp/messages' // Endpoint URL you configured in the sandbox, used for validation
});
*/


adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);
    var errorTxt = `${ error }`  
    
    console.log("errorTxt = " + errorTxt);
    
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    if (errorTxt.indexOf('LINE api',0) != -1)
        {
        await context.sendActivity('LINE users have limited functionality with FIDICchatbot. Please use FIDICbot at @ovs8540y. See http://FIDIC.tips/bot');
        }
        else
        {
        await context.sendActivity('Sorry. Input not understood.');
        await context.sendActivity('Please submit \"start\" to start again.');
        }
    
    /*
    // Send a message to the user
    let onTurnErrorMessage = 'The bot encountered an error or bug.';
    await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
    onTurnErrorMessage = 'To continue to run this bot, please fix the bot source code.';
    await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
    // Clear out state
    await conversationState.delete(context);
    */
  
};

const memoryStorage = new MemoryStorage();

const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

////const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
////const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: LuisAPIHostName };

////const luisRecognizer = new FlightBookingRecognizer(luisConfig);

/*
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
*/

const dialog = new RootDialog(userState);

//const bot = new QnAMultiturnBot(conversationState, userState, dialog);
const bot = new WelcomeBot(conversationState, userState, dialog);


server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        // Route the message to the bot's main handler.
        await bot.run(turnContext);
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
