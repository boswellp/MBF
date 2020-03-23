// Copyright (c) Bricad Associates 2020

const { ActivityHandler, MessageFactory, CardFactory} = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');

class QnAMultiturnBot extends ActivityHandler {
 
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
            console.log('\nRunning dialog with Message Activity.');

            await this.dialog.run(context, this.dialogState);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
         console.log('28 context.activity = ' + context.activity)
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
               if (membersAdded[cnt].id !== context.activity.recipient.id) {

                 welcomeCard.body[1].text = 'Welcome to FIDICchatbot';

                 const restartCommand = 'start';
        
                 welcomeCard.body[2].text = 'The chatbot allows you to search FIDIC contracts.';

                 welcomeCard.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';

                 welcomeCard.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword (keywords search in the index of clauses).';

                 welcomeCard.body[4].text = 'After selecting a contract, clauses are displayed by submitting a clause number or a keyword.';

                 welcomeCard.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated.';

                 welcomeCard.body[5].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';

                 welcomeCard.body[6].text = 'FIDICchatbot is complemented by FIDICbot that suppplies messenging channels (e.g., LINE and Viber) that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the https://FIDIC.tips initiative.';

                 welcomeCard.actions[0].title = 'Privacy policy';

                 welcomeCard.actions[0].url = process.env.publicResourcesUrl + 'privacy_policy_en.pdf';

                 await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard)]});

                 await context.sendActivity('Welcome to the FIDICchatbot which allows you to search FIDIC contracts'); 

                 var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');

                 await context.sendActivity(reply);

                 }
            }

            await next();
        });

        this.onDialog(async (context, next) => {

            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            await next();
        });

    }
}

module.exports.QnAMultiturnBot = QnAMultiturnBot;

