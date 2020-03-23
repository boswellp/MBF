// Import required Bot Framework classes.
const { ActionTypes, ActivityHandler, CardFactory, MessageFactory } = require('botbuilder');

// Welcomed User property name
const WELCOMED_USER = 'welcomedUserProperty';

class WelcomeBot extends ActivityHandler {
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
    constructor(conversationState, userState, dialog) {
        super();


        if (!conversationState) throw new Error('[welcomeBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[welcomeBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[welcomeBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);


        this.onMessage(async (context, next) => {

            // If the 'DidBotWelcomedUser' does not exist (first time ever for a user)
            // set the default to false.

            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            // Your bot should proactively send a welcome message to a personal chat the first time
            // (and only the first time) a user initiates a personal chat with your bot.

            if (didBotWelcomedUser === false) {

                await this.sendIntroCard(context);

                await context.sendActivity('FALSE Thank you for making use of FIDICbot. Please let us know if you have any comments. You are seeing this message because this was your first message ever sent to this bot. It is a good practice to welcome the user and provide personal greeting.');



                await this.welcomedUserProperty.set(context, true);
                } 

                else 

                {
                



            }

            await next();
        });


        // Sends welcome messages to conversation members when they join the conversation. Messages are only sent to conversation members who aren't the bot.
        this.onMembersAdded(async (context, next) => {
            for (const idx in context.activity.membersAdded) {

                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) 

                    {

                    await context.sendActivity('Welcome to FIDICchatbot. CARD? This bot will introduce you to welcoming and greeting users.');
                    await context.sendActivity('It is a good pattern to use this event to send general greeting to user, explaining what your bot can do. In this example, the bot handles \'start\', \'hello\', \'hi\', \'help\' and \'intro\'. ' + 'Try it now, type \'hi\'');

                    //await this.sendIntroCard(context);
                



                    var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');
                    await context.sendActivity(reply);


                    }
            }

            await next();
        });


        this.onMessage(async (context, next) => { //ORIG FROM multiturn
            console.log('\nRunning dialog with Message Activity.');
            await this.dialog.run(context, this.dialogState);
            await next(); 
            });

///////////
/*
        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);

            await next();
            });
*/



}




/*
///from https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-dialog-manage-conversation-flow?view=azure-bot-service-4.0&tabs=javascript

async run(context, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
    }
}
*/




    async run(context) {
        await super.run(context);
        await this.userState.saveChanges(context);
        }



    async sendIntroCard(context) {
        const card = CardFactory.heroCard(
            'Welcome to Bot Framework!',
            'Welcome to Welcome Users bot sample! This Introduction card is a great way to introduce your Bot to the user and suggest some things to get them started. We use this opportunity to recommend a few next steps for learning more creating and deploying bots.',
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
}

module.exports.WelcomeBot = WelcomeBot;
