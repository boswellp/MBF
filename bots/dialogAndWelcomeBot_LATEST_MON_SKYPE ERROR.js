// Copyright (c) Bricad Associates

const { DialogBot } = require('./dialogBot');

const { ActivityHandler, MessageFactory } = require('botbuilder');

const { CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');

const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

class DialogAndWelcomeBot extends DialogBot { 

    constructor(conversationState, userState, dialog) {

        super(conversationState, userState, dialog);


        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
        this.conversationState = conversationState;
        this.userState = userState;

        this.onMessage(async (turnContext, next) => {

            const userProfile = await this.userProfileAccessor.get(turnContext, {});

            const conversationData = await this.conversationDataAccessor.get(
                turnContext, { promptedForUserName: false });

            if (!userProfile.name) {

                if (conversationData.promptedForUserName) {

                    userProfile.name = turnContext.activity.text;

                    //await turnContext.sendActivity(`Thanks2222 ${ userProfile.name }. To see conversation data, type anything.`);
                    await turnContext.sendActivity('');

                    conversationData.promptedForUserName = false;

                    await next();
                } 
                else 
                {
                    //await turnContext.sendActivity('1. What is your name?');
                    await turnContext.sendActivity('');

                    conversationData.promptedForUserName = true;
                }
            } 
            else
            {

                conversationData.timestamp = turnContext.activity.timestamp.toLocaleString();
                conversationData.channelId = turnContext.activity.channelId;


                //await turnContext.sendActivity(`${ userProfile.name } : ${ turnContext.activity.text }`);
                //await turnContext.sendActivity(`Message received at: ${ conversationData.timestamp }`);
                //await turnContext.sendActivity(`Message received from: ${ conversationData.channelId }`);
            }

            await next();
        });




/////////////////////


        this.onMembersAdded(async (context, next) => {

            const membersAdded = context.activity.membersAdded;

            for (let cnt = 0; cnt < membersAdded.length; cnt++) {

                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                    const reply = `Welcome. The FIDICchatbot allows you to search FIDIC contracts. Submit "start" to start, or to restart at any time. Submit "help" for help.`;


//////////////////////


        //welcomeCard.body[0].url = process.env.publicResourcesUrl + '/public/fidicchatbot_logo.png';

        welcomeCard.body[1].text = 'Welcome to FIDICchatbot';

        const restartCommand = 'start';
        
        welcomeCard.body[2].text = 'The chatbot allows you to search FIDIC contracts.';

        welcomeCard.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';

        welcomeCard.body[4].text = 'After selecting a contract, you can display clauses by submitting a clause number or a keyword (keywords search in the index of clauses).';

        welcomeCard.body[5].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';

        welcomeCard.body[5].text = 'The FIDICchatbot is developed by Bricad Associates, Switzerland, as part of the https://FIDIC.tips initiative. It complements the FIDICbot that offers similar functionality and allows full-text searching.';

        welcomeCard.actions[0].title = 'Privacy policy';

        welcomeCard.actions[0].url = process.env.publicResourcesUrl + 'privacy_policy_en.pdf';

        await context.sendActivity({
                attachments: [CardFactory.adaptiveCard(welcomeCard)]
            });


await this.sendSuggestedActions(context);


                }
            }
            await next();
        });

    }


async sendSuggestedActions(context) {
        var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');
        await context.sendActivity(reply);
    }


     async run(context) {
        await super.run(context);


        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
        //console.log (".............dialog and welcome SAVE... this.userState = " + JSON.stringify(this.userState));
    }

//////////


}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
