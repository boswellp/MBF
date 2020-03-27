// Copyright (c) Microsoft Corporation. All rights reserved.

const { ActivityHandler, MessageFactory, ActionTypes, CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');

const WELCOMED_USER = 'welcomedUserProperty';
//const WELCOMED_USER_STATUS = 'welcomedStatus';

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
        this.welcomedState = this.conversationState.createProperty('WelcomedState');
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);


        this.onMessage(async (context, next) => {
            console.log('\n_Running dialog with Message Activity.');
            await this.dialog.run(context, this.dialogState);
            await next();
            });

        this.onMessage(async (context, next) => {

           const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

           if (didBotWelcomedUser == 0)  //FALSE - FIRST WELCOME
                {
                //await context.sendActivity('For the first message to this chatbot, we shall display here how the chatbot works.');
                
                //await this.sendWelcomeCard(context);
                //await context.sendActivity("Welcome");
                    
                 welcomeCard.body[1].text = 'Welcome to FIDICchatbot';
                 welcomeCard.body[2].text = 'The chatbot allows you to search FIDIC contracts.';
                 welcomeCard.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';
                 welcomeCard.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword (keywords search in the index of clauses).';
                 welcomeCard.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated.';
                 welcomeCard.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';
                 welcomeCard.body[7].text = 'FIDICchatbot is complemented by FIDICbot that suppplies messenging channels (e.g., LINE and Viber) that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the https://FIDIC.tips initiative.';

                 await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard)]});
                    
                    
                    
                   
                await this.welcomedUserProperty.set(context, 1);
                const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
                console.log ("\n_48 didBotWelcomedUser = " + didBotWelcomedUser);

                } 
                else if (didBotWelcomedUser == 1)
                {  
 
                //const userStatus = await this.welcomedUserProperty.get(context, false);
                    
                await this.welcomedUserProperty.set(context, 2);

                //await this.sendGuidanceCard(context);
                //await context.sendActivity("Guidance");
                    
                 welcomeCard.body[1].text = 'FIDICchatbot guide';
                 welcomeCard.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword (keywords search in the index of clauses).';
                 welcomeCard.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated.';
                 welcomeCard.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';
                 
                 await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard)]});
               
               }

        await next();

        });

        this.onMembersAdded(async (context, next) => { 

            const membersAdded = context.activity.membersAdded;

            for (let cnt = 0; cnt < membersAdded.length; cnt++) {

                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                     await this.welcomedUserProperty.set(context, 2);

                     //await this.sendWelcomeCard(context);
                    
                 welcomeCard1.body[1].text = 'Welcome to FIDICchatbot';
                 welcomeCard1.body[2].text = 'The chatbot allows you to search FIDIC contracts.';
                 welcomeCard1.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';
                 welcomeCard1.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword (keywords search in the index of clauses).';
                 welcomeCard1.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated.';
                 welcomeCard1.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are:\n- "c1" - Construction Contract 1st Ed 1999\n- "p1" - Plant Contract 1st Ed 1999.';
                 welcomeCard1.body[7].text = 'FIDICchatbot is complemented by FIDICbot that suppplies messenging channels (e.g., LINE and Viber) that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the https://FIDIC.tips initiative.';

                 await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard1)]});
               
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
    
/////////////////////
    async sendGuidanceCard(context) {

        const cardGuidance = CardFactory.heroCard(
            'FIDICchatbot',
            'Please take a moment to see how the chatbot is used to search FIDIC contracts.',
            ['https://aka.ms/bf-welcome-card-image'],
            [
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Overview',
                    value: 'https://fidic.tips/fidicbot'
                },
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Web version',
                    value: 'https://fidic.tips/fidicbotalone'
                },
                {
                    type: ActionTypes.PostBack,
                    title: 'START',
                    value: 'start'
                }
            ]
        );

        await context.sendActivity({ attachments: [cardGuidance] });

    }

    async sendWelcomeCard(context) {

        const cardWelcome = CardFactory.heroCard(
            'Welcome to the FIDICchatbot',
            'The chatbot allows you to search FIDIC contracts.',
            ['https://aka.ms/bf-welcome-card-image'],
            [
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Overview',
                    value: 'https://fidic.tips/fidicbot'
                },
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Web version',
                    value: 'https://fidic.tips/fidicbotalone'
                },
                {
                    type: ActionTypes.PostBack,
                    title: 'START',
                    value: 'start'
                }
            ]
        );

        await context.sendActivity({ attachments: [cardWelcome] });

    }
/////////////////////
    
    
    
}

module.exports.QnAMultiturnBot = QnAMultiturnBot;
