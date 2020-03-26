// Copyright (c) Bricad Associates 2020

const QNAMULTITURNBOT = 'QNAMULTITURNBOT';

const { ActivityHandler, MessageFactory, ActionTypes, CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');
const welcomeCard1 = require('../resources/WelcomeCard1.json');

const WELCOMED_USER = 'welcomedUserProperty';
const WELCOMED_USER_STATUS = 'welcomedStatus';

const CONVERSATION_DATA_PROPERTY = 'conversationData';

class QnAMultiturnBot extends ActivityHandler {
 
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog); //made this super
        if (!conversationState) throw new Error('[QnAMultiturnBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[QnAMultiturnBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[QnAMultiturnBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        //console.log ("\n_25 this.dialogState = " + JSON.stringify(this.dialogState));

        this.welcomedState = this.conversationState.createProperty('WelcomedState');

        //console.log ("\n_25 this.welcomeState = " + JSON.stringify(this.welcomedState));

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.userWelcomeAccessor = userState.createProperty(WELCOMED_USER_STATUS);

        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);  


        this.onMessage(async (context, next) => {
            console.log('\nRunning dialog with Message Activity.');
            await this.dialog.run(context, this.dialogState);
            await next(); 
            });


       this.onMessage(async (context, next) => {

            this.conversationDataAccessor.conversationData = true;
            console.log ("\n_49 this.conversationDataAccessor.conversationData = " + this.conversationDataAccessor.conversationData);

            this.conversationDataAccessor.conversationData = true;
            //await this.conversationDataAccessor.set(context, true);
            console.log ("\n_53 this.conversationDataAccessor.conversationData = " + JSON.stringify(this.conversationDataAccessor.conversationData));

           this.welcomedUserProperty.welcomedUserProperty = 'yyyyyyyy11111111111';

           await this.welcomedUserProperty.set(context, 'xxxxxxxx111111111');
           const didBotWelcomedUser00 = await this.welcomedUserProperty.get(context, false);
           console.log ("\n_58 didBotWelcomedUser00 = " + didBotWelcomedUser00);


            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            if (didBotWelcomedUser === false){

                this.welcomedUserProperty.welcomedUserProperty = 'yyyyyyyy22222222222222';

                await this.welcomedUserProperty.set(context, 'xxxxxxxxxx22222');
                const didBotWelcomedUser0 = await this.welcomedUserProperty.get(context, false);
                console.log ("\n_58 didBotWelcomedUser0 = " + didBotWelcomedUser0);


                await this.sendIntroCard(context);

/*
                //console.log ("\n_66 this.conversationState.WelcomedState = " + JSON.stringify(this.conversationState.WelcomedState));

                // User's first message handled
                this.userWelcomeAccessor.welcomedStatus = true; 

                //this.conversationState.WelcomedState = true;



                console.log ("\n_65 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);
                
                 this.userWelcomeAccessor.welcomedStatus = true

                 console.log ("\n_116 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);


                 console.log ("\n_116 this.welcomedUserProperty = " + this.welcomedUserProperty);


*/

            } else {




               this.welcomedUserProperty.welcomedUserProperty = 'yyyyyyyyyyyyyyyy';

               console.log ("\n_102 this.welcomedUserProperty.welcomedUserProperty = " + JSON.stringify(this.welcomedUserProperty.welcomedUserProperty));

               console.log ("\n_102 this.welcomedUserProperty = " + JSON.stringify(this.welcomedUserProperty));

               await this.welcomedUserProperty.set(context, 'xxxxxxxxxxxxxxxxxset');

               const didBotWelcomedUserXX = await this.welcomedUserProperty.get(context, false);
               console.log ("\n_102 didBotWelcomedUserXX = " + didBotWelcomedUserXX);



/*

                this.conversationDataAccessor.conversationData = true;
                //await this.conversationDataAccessor.set(context, true);
                // await this.userProfileAccessor.set(stepContext.context, userInfo);
                 console.log ("\n_102 this.conversationDataAccessor.conversationData = " + JSON.stringify(this.conversationDataAccessor.conversationData));

                  //console.log ("\n_102 this.conversationState = " + JSON.stringify(this.conversationState));

                this.userWelcomeAccessor.welcomedStatus = null; 

                console.log ("\n_62 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);

                //this.conversationState.WelcomedState = null;

                 this.userWelcomeAccessor.welcomedStatus = true

                 console.log ("\n_116 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);

                 console.log ("\n_116 this.welcomedUserProperty = " + this.welcomedUserProperty);


*/
                
                const text = context.activity.text.toLowerCase();
                switch (text) {
                case 'hello':
                case 'hi':
                    await context.sendActivity(`You said "${ context.activity.text }"`);
                    break;
                case 'intro':
                case 'help':
                    await this.sendIntroCard(context);
                    break;
                default:
                    //await context.sendActivity(`This is a simple Welcome Bot sample. You can say 'intro' to see the introduction card. If you are running this bot in the Bot Framework Emulator, press the 'Start Over' button to simulate user joining a bot or a channel`);
                    await this.sendIntroCard(context);

                }

            }

            await next();
        });


        this.onMembersAdded(async (context, next) => { 




           await this.welcomedUserProperty.set(context, true);
           const didBotWelcomedUser3 = await this.welcomedUserProperty.get(context, false);
           console.log ("\n_160 didBotWelcomedUser3 = " + didBotWelcomedUser3);
   
           const membersAdded = context.activity.membersAdded;     
           for (let cnt = 0; cnt < membersAdded.length; cnt++) { 
              if (membersAdded[cnt].id !== context.activity.recipient.id) { 


                 this.userWelcomeAccessor.welcomedStatus = true

                 //await this.conversationDataAccessor.set(context, true);
                 this.conversationDataAccessor.conversationData = true;
                 console.log ("\n_169 this.conversationDataAccessor.conversationData = " + JSON.stringify(this.conversationDataAccessor.conversationData));

/*
                 console.log ("\n_116 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);



*/

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

                 var reply = MessageFactory.suggestedActions(['start'], '');
                 await context.sendActivity(reply);

                 }
            }

            await next();

        });


        //this.onDialog(async (context, next) => {
           // await this.conversationState.saveChanges(context, false);
            //await this.userState.saveChanges(context, false);
           // await next();
        //});


    }



async sendIntroCard(context) {

        const card = CardFactory.heroCard(
            'About FIDICchatbot',
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
                    title: 'start',
                    value: 'start'
                }
            ]
        );

        await context.sendActivity({ attachments: [card] });

    }

async run(context) {

        await super.run(context);

        //console.log ("\n_133 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);

        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);

        //console.log ("\n_42 this.userWelcomeAccessor.welcomedStatus = " + this.userWelcomeAccessor.welcomedStatus);

    }

}

module.exports.QnAMultiturnBot = QnAMultiturnBot;
module.exports.QNAMULTITURNBOT = QNAMULTITURNBOT; //added

