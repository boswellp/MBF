// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//const { ActivityHandler } = require('botbuilder'); //ORIG
const { ActivityHandler, MessageFactory, CardFactory} = require('botbuilder'); //MINE

const welcomeCard = require('../resources/WelcomeCard.json');


class QnAMultiturnBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationState, userState, dialog) {
        super();
        if (!conversationState) throw new Error('[QnAMultiturnBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[QnAMultiturnBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[QnAMultiturnBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');

            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // If a new user is added to the conversation, send them a greeting message
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {


////////////////////////

        welcomeCard.body[1].text = 'Welcome to FIDICchatbot';

        const restartCommand = 'start';
        
        welcomeCard.body[2].text = 'The chatbot allows you to search FIDIC contracts.';

        welcomeCard.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';

        welcomeCard.body[4].text = 'After selecting a contract, you can display clauses by submitting a clause number or a keyword (keywords search in the index of clauses).';

        welcomeCard.body[5].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';

        welcomeCard.body[5].text = 'The FIDICchatbot is developed by Bricad Associates, Switzerland, as part of the https://FIDIC.tips initiative. It complements the FIDICbot that offers similar functionality and allows full-text searching.';

        welcomeCard.actions[0].title = 'Privacy policy';

        welcomeCard.actions[0].url = process.env.publicResourcesUrl + 'privacy_policy_en.pdf';

        await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard)]});

////////////////



                    await context.sendActivity('Welcome to the FIDICchatbot which allows you to search FIDIC contracts'); //ORIG


                    var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.'); //MINE


                    await context.sendActivity(reply);  //MINE

                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });






        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });






    }
}

module.exports.QnAMultiturnBot = QnAMultiturnBot;

