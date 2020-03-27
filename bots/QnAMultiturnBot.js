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
        //this.userWelcomeAccessor = userState.createProperty(WELCOMED_USER_STATUS);

        this.onMessage(async (context, next) => {

            console.log('\n_Running dialog with Message Activity.');

            await this.dialog.run(context, this.dialogState);

            await next();
            });

        this.onMessage(async (context, next) => {

           const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

           if (didBotWelcomedUser == 0)  //FALSE - FIRST WELCOME

                {
                 await context.sendActivity('For the first message to this chatbot, we shall display here how the chatbot works.');
                //await this.sendIntroCard(context);
                    
                await this.welcomedUserProperty.set(context, 1);
                const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
                console.log ("\n_48 didBotWelcomedUser = " + didBotWelcomedUser);

                } 
               else if (didBotWelcomedUser == 1)
                   {  //TRUE SECOND VISIT REMOVE


                    
                   const userStatus = await this.welcomedUserProperty.get(context, false);
                 
                   if (userStatus != null){await context.sendActivity('We shall shortly remove this remark.');}
               
                   //await this.sendIntroCard(context);
                
                   //if (userStatus.indexOf('removeNo',0) != -1){await this.welcomedUserProperty.set(context, 'removeYes')}
                    
                   await this.welcomedUserProperty.set(context, null);
                   }
               }

        await next();

        });

        this.onMembersAdded(async (context, next) => { //WHEN SHOWN?

            const membersAdded = context.activity.membersAdded;

            for (let cnt = 0; cnt < membersAdded.length; cnt++) {

                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                     await this.welcomedUserProperty.set(context, 2);
                    
                     //await context.sendActivity('Welcome to the FIDICchatbot. Please submit \"start\" to start.');
                    
                    
                     const card = CardFactory.heroCard(
            'Welcome to the FIDIC chatbot',
            'FIDICchatbot allows you to search FIDIC contracts.',
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
                    title: 'start',
                    value: 'start'
                }
            ]
        );

                 await context.sendActivity({ attachments: [card] });

                 var reply = MessageFactory.suggestedActions(['start'], '')
                 

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
