// Import required Bot Framework classes.
const { ActionTypes, ActivityHandler, CardFactory } = require('botbuilder');

// Welcomed User property name
const WELCOMED_USER = 'welcomedUserProperty';

class WelcomeBot extends ActivityHandler {
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
    constructor(userState) {
        super();

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.userState = userState;

//webchat start        
  if (context.activity.name === 'webchat/join') {
  await context.sendActivity(`Got \`webchat/join\` event, your language is \`${ (context.activity.value || {}).language }\``);
}
        

//method 2

this.onEvent(async (context, next) => {
  if (context.activity.name === 'webchat/join') {
    await context.sendActivity('Back Channel Welcome Message!');
  }
  await next();
});

/*
this.onMembersAdded(async (context, next) => {
  const { channelId, membersAdded } = context.activity;

  if (channelId !== 'directline' && channelId !== 'webchat') {
    for (let member of membersAdded) {
      if (member.id !== context.activity.recipient.id) {
        await context.sendActivity("WORS LOCAL Welcome Message from `onMembersAdded` handler!");
      }
    }
  }
  await next();
});
        
*/



        this.onMessage(async (context, next) => {

            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);


            if (didBotWelcomedUser === false) {

                const userName = context.activity.from.name;
                await context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
                await context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);

                await this.welcomedUserProperty.set(context, true);
            } else {
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
                    await context.sendActivity(`This is a simple Welcome Bot sample. You can say 'intro' to see the introduction card. If you are running this bot in the Bot Framework Emulator, press the 'Start Over' button to simulate user joining a bot or a channel`);
                }
            }

            await next();
        });

        
  this.onMembersAdded(async (context, next) => {
  const { membersAdded } = context.activity;

  for (let member of membersAdded) {
    if (member.id !== context.activity.recipient.id) {
      await context.sendActivity("Welcome Message from `onMembersAdded` handler!");
    }
  }
  await next();
});
        
/*
        


/////added from https://github.com/microsoft/BotFramework-WebChat/issues/2120#issuecomment-516056614







///////added from end


////added end

/*
        this.onMembersAdded(async (context, next) => {
            for (const idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity('onMembersAdded LONG Welcome to the \'Welcome User\' FIDICchatbot. This bot will introduce you to welcoming and greeting users.');
                    await context.sendActivity("You are seeing this message because the bot received at least one 'ConversationUpdate' " +
                        'event, indicating you (and possibly others) joined the conversation. If you are using the emulator, ' +
                        'pressing the \'Start Over\' button to trigger this event again. The specifics of the \'ConversationUpdate\' ' +
                        'event depends on the channel. You can read more information at https://aka.ms/about-botframework-welcome-user');
                    await context.sendActivity('It is a good pattern to use this event to send general greeting to user, explaining what your bot can do. ' +
                        'In this example, the bot handles \'hello\', \'hi\', \'help\' and \'intro\'. ' +
                        'Try it now, type \'hi\'');
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

*/



    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save state changes
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
