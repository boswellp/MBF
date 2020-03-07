// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { DialogBot } = require('./dialogBot');


const { CardFactory } = require('botbuilder');
const { ActivityHandler } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');

const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

class DialogAndWelcomeBot extends DialogBot { //used this for multiturn

//class DialogAndWelcomeBot extends ActivityHandler { //shows name, etc

    constructor(conversationState, userState, dialog) {

        super(conversationState, userState, dialog);

///////
        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
        //this.userContractAccessor = userState.createProperty('contractName');
        this.conversationState = conversationState;
        this.userState = userState;
///////


       this.onMessage(async (turnContext, next) => {
            // Get the state properties from the turn context.
            const userProfile = await this.userProfileAccessor.get(turnContext, {});
            //const contractName = await this.userContractAccessor.get(turnContext, {});
            const conversationData = await this.conversationDataAccessor.get(
                turnContext, { promptedForUserName: false });

            if (!userProfile.name) {
                // First time around this is undefined, so we will prompt user for name.
                if (conversationData.promptedForUserName) {
                    // Set the name to what the user provided.
                    userProfile.name = turnContext.activity.text;
                    //contractName.name = turnContext.activity.text;

                    //await turnContext.sendActivity(`Thanks2222 ${ userProfile.name }. To see conversation data, type anything.`);
                    await turnContext.sendActivity('');


                    // Reset the flag to allow the bot to go though the cycle again.
                    conversationData.promptedForUserName = false;

                    await next();//MINE ADDED
                } 
                else 
                {
                    //await turnContext.sendActivity('1. What is your name?');
                    await turnContext.sendActivity('');
                    // Set the flag to true, so we don't prompt in the next turn.
                    conversationData.promptedForUserName = true;
                }
            } 
            else
            {
                // Add message details to the conversation data.
                conversationData.timestamp = turnContext.activity.timestamp.toLocaleString();
                conversationData.channelId = turnContext.activity.channelId;

                // Display state data.
                //await turnContext.sendActivity(`${ userProfile.name } sent3333: ${ turnContext.activity.text }`);
                //await turnContext.sendActivity(`Message received at: ${ conversationData.timestamp }`);
                //await turnContext.sendActivity(`Message received from: ${ conversationData.channelId }`);
            }

            await next();
        });




///////


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

        welcomeCard.body[4].text = 'After selecting a contract, you can display clauses by submiting a clause number or a keyword (keywords search in the index of clauses).';

        welcomeCard.body[5].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';

        welcomeCard.body[5].text = 'The FIDICchatbot is developed by Bricad Associates, Switzerland, as part of the https://FIDIC.tips initiative. It complements the FIDICbot that offers similar functionality and allows full-text searching.';

        welcomeCard.actions[0].title = 'Privacy policy';

        welcomeCard.actions[0].url = process.env.publicResourcesUrl + 'privacy_policy_en.pdf';

        await context.sendActivity({
                attachments: [CardFactory.adaptiveCard(welcomeCard)]
            });



//////////////////////


                }
            }
            await next();
        });
    }

/////////
    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */

     async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
        //console.log (".............dialog and welcome SAVE... this.userState = " + JSON.stringify(this.userState));
    }

//////////


}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
