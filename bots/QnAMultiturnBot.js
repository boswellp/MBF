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

           if (didBotWelcomedUser === false)

                {


/////////

                await this.welcomedUserProperty.set(context, '51xxxxxxxxxxxxxxxxxset');

                const didBotWelcomedUserXX = await this.welcomedUserProperty.get(context, false);

                console.log ("\n_51 didBotWelcomedUserXX = " + didBotWelcomedUserXX);

///////





                 await context.sendActivity('This is Intro KILL');
                //await this.sendIntroCard(context);

                } else {


                const text = context.activity.text.toLowerCase();
                await context.sendActivity('We shall shortly display here how the chatbot works.');
                //await this.sendIntroCard(context);

                }
             }

        await next();

        });

        this.onMembersAdded(async (context, next) => {

            const membersAdded = context.activity.membersAdded;

            for (let cnt = 0; cnt < membersAdded.length; cnt++) {

                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                    await context.sendActivity('Welcome to the FIDICchatbot. Please submit \"start\" to start.');

                    //await this.sendIntroCard(context);

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
