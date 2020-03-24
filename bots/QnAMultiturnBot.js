// Copyright (c) Bricad Associates 2020

const { ActivityHandler, MessageFactory, ActionTypes, CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');

const WELCOMED_USER = 'welcomedUserProperty'; //ADDED

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

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER); //ADDED



        this.onMessage(async (context, next) => {
            console.log('\nRunning dialog with Message Activity.');
            await this.dialog.run(context, this.dialogState);
            await next(); 
            });

/////////////////////////////

       this.onMessage(async (context, next) => {

            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);


            if (didBotWelcomedUser === false) {

                await this.sendIntroCard(context);

                await this.welcomedUserProperty.set(context, true);
            } else {

            }

            await next();
        });

//////////////////////////////




        this.onMembersAdded(async (context, next) => { //orig
    
           const membersAdded = context.activity.membersAdded; //orig     
           for (let cnt = 0; cnt < membersAdded.length; cnt++) { //orig
              if (membersAdded[cnt].id !== context.activity.recipient.id) { //orig

                 welcomeCard.body[1].text = 'Welcome to FIDICchatbot';
        
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


/////////////////

async run(context) {
        await super.run(context);
        }

async sendIntroCard(context) {
        const card = CardFactory.heroCard(
            'FIDICchatbot',
            'Before selecting a contract for the first time, please take a moment to see how the chatbot searches FIDIC contracts.',
            ['https://aka.ms/bf-welcome-card-image'],
            [
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Get an overview',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0'
                },
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Ask a question',
                    value: 'https://stackoverflow.com/questions/tagged/botframework'
                },
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Learn how to deploy',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-deploy-azure?view=azure-bot-service-4.0'
                }
            ]
        );

        await context.sendActivity({ attachments: [card] });
    }

//////////////////


}

module.exports.QnAMultiturnBot = QnAMultiturnBot;

