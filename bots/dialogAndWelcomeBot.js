// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { DialogBot } = require('./dialogBot');

const { CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');

class DialogAndWelcomeBot extends DialogBot {

    constructor(conversationState, userState, dialog) {

        super(conversationState, userState, dialog);

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

        welcomeCard.body[4].text = 'Submit "start" to start.';

        welcomeCard.actions[0].title = 'Privacy policy';

        welcomeCard.actions[0].url = process.env.publicResourcesUrl + 'privacy_policy_en.pdf';

        await context.sendActivity({
                attachments: [CardFactory.adaptiveCard(welcomeCard)]
            });



//////////////////////




                    //await context.sendActivity(card);

                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }


}

module.exports.DialogAndWelcomeBot = DialogAndWelcomeBot;
