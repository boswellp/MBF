// Copyright (c) Microsoft Corporation. All rights reserved.

const { ActivityHandler, MessageFactory, ActionTypes, CardFactory } = require('botbuilder');

const welcomeCard = require('../resources/WelcomeCard.json');
const welcomeCard1 = require('../resources/WelcomeCard1.json');
const guidanceCard = require('../resources/GuidanceCard.json');

const WELCOMED_USER = 'welcomedUserProperty';

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

           if (didBotWelcomedUser == 0)
                 {
                     
                 const didBotWelcomedUser0 = await this.welcomedUserProperty.get(context, false);
                     
                 console.log ("\n_42 context.activity.channelId = " + context.activity.channelId);

                 if (context.activity.channelId == 'skype'){
                     
                     await this.sendWelcomeCard(context);  
                     
                     } else {
                     
                     welcomeCard.body[1].text = 'Welcome to FIDICchatbot';
                     welcomeCard.body[2].text = 'A search engine for the FIDIC contracts for construction.';
                     welcomeCard.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';
                     welcomeCard.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.';
                     welcomeCard.body[5].text = 'Keywords search the index of clauses, or the General Conditions when searching is activated. To activate searching, click \"c1 search\" or submit a contract code with an \"s\" (e.g., \"c1s\" for the Construction Contract 1st Edition 1999).';
                     welcomeCard.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are "c1" for the Construction Contract 1st Ed 1999, "p1" for the Plant & Design-Build Contract 1st Ed 1999 and "e1" for the EPC/Turnkey Contract 1st Ed 1999.';
                     welcomeCard.body[7].text = '[FIDICchatbot](https://fidic.tips/chatbot) is complemented by [FIDICbot](https://fidic.tips/bot) that serves messaging channels that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the [FIDIC.tips](https://FIDIC.tips) initiative.';
                     await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard)]});
                         
                     var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');
                     await context.sendActivity(reply); 
                     }
                     
                 await this.welcomedUserProperty.set(context, 1);

                 const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

                 console.log ("\n_68 didBotWelcomedUser set to " + didBotWelcomedUser);

                 } 
                 else if (didBotWelcomedUser == 1)
                 { 
                     
                 const didBotWelcomedUser00 = await this.welcomedUserProperty.get(context, false);
                 console.log ("\n_74 didBotWelcomedUser00 =" + didBotWelcomedUser00);
 
                 await this.welcomedUserProperty.set(context, 2);
                 const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

                 console.log ("\n_79 context.activity.channelId = " + context.activity.channelId);

                 if (context.activity.channelId == 'skype'){
                     
                     await this.sendGuidanceCard(context); 
                     await this.sendGuidanceCard1(context);
                     await this.sendGuidanceCard2(context);
                     await this.sendGuidanceCard3(context);
                     
                     } else {
             
                    guidanceCard.body[1].text = 'FIDICchatbot guide';
                    guidanceCard.body[2].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.';
                    guidanceCard.body[3].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated, starting with \"start\" or by submitting a contract code with an \"s\" (e.g., \"c1 s\" for the Construction Contract 1st Edition 1999).';
                    guidanceCard.body[4].text = 'Shortcut codes for contracts that can be submitted at any time are "c1" for the Construction Contract 1st Ed 1999 and "p1"for the Plant & Design-Build Contract 1st Ed 1999 (in the process of being uploaded).';
                    await context.sendActivity({attachments: [CardFactory.adaptiveCard(guidanceCard)]});
                         
                    var reply = MessageFactory.suggestedActions(['start'], 'Please submit "start" to start.');
                    await context.sendActivity(reply);  
                    }
                    
               
               }

        await next();

        });

        this.onMembersAdded(async (context, next) => { 
             
            const membersAdded = context.activity.membersAdded;
            
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {

                if (membersAdded[cnt].id !== context.activity.recipient.id) {

                    await this.welcomedUserProperty.set(context, 2);

                    console.log ("\n_117 context.activity.channelId = " + context.activity.channelId);

                    if (context.activity.channelId == 'skype'){
                     
                         await this.sendWelcomeCard(context);  
                     
                         } else {
                    
                         welcomeCard1.body[1].text = 'Welcome to FIDICchatbot';
                         welcomeCard1.body[2].text = 'A search engine for the FIDIC contracts for construction.';
                         welcomeCard1.body[3].text = 'Submit "start" or "help" anytime to start again and for help.';
                         welcomeCard1.body[4].text = 'After selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.';
                         welcomeCard1.body[5].text = 'Keywords search the index of clauses, or in the General Conditions when searching is activated, starting with \"start\" or by submitting a contract code with an \"s\" (e.g., \"c1 s\" for the Construction Contract 1st Edition 1999).';
                         welcomeCard1.body[6].text = 'Shortcut codes for contracts that can be submitted at any time are "c1" for Construction Contract 1st Ed 1999 and "p1" for Plant & Design-Build Contract 1st Ed 1999 (in the process of being uploaded).';
                         welcomeCard1.body[7].text = '[FIDICchatbot](https://fidic.tips/chatbot) is complemented by [FIDICbot](https://fidic.tips/bot) that suppplies messenging channels (e.g., LINE and Viber) that are not served by FIDICchatbot. Both bots are developed by Bricad Associates, Switzerland, as part of the [FIDIC.tips](https://FIDIC.tips) initiative.';
                         await context.sendActivity({attachments: [CardFactory.adaptiveCard(welcomeCard1)]});
                         }
                    
                               
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
    
     async sendGuidanceCard(context) {

        const cardGuidance = CardFactory.heroCard(
            '',
            'Please take a moment to see how to search FIDIC contracts.\nAfter selecting a contract, General Conditions clauses are displayed by submitting a clause number or a keyword.',
            [{}]
        );
        await context.sendActivity({ attachments: [cardGuidance] });
    }
    
         async sendGuidanceCard1(context) {

        const cardGuidance1 = CardFactory.heroCard(
            '',
            'Keywords search the index of clauses, or in the General Conditions when searching is activated, starting with \"start\" or by submitting a contract code with an \"s\" (e.g., \"c1 s\" for the Construction Contract 1st Edition 1999).',
            [{}]
        );
        await context.sendActivity({ attachments: [cardGuidance1] });
    }
    
    async sendGuidanceCard2(context) {

        const cardGuidance2 = CardFactory.heroCard(
            '',
            'Shortcut codes that can be submitted at any time are "c1" for Construction 1st Ed 1999 and "p1" for the Plant 1st Ed 1999.',
            [{}]
        );
        await context.sendActivity({ attachments: [cardGuidance2] });
    }
    
        async sendGuidanceCard3(context) {

        const cardGuidance3 = CardFactory.heroCard(
            '',
            '',
            [{}],
            [
                {
                    type: ActionTypes.PostBack,
                    title: 'start',
                    value: 'start'
                }
            ]
        );
        await context.sendActivity({ attachments: [cardGuidance3] });
    }

    async sendWelcomeCard(context) {

        const cardWelcome = CardFactory.heroCard(
            'Welcome',
            'A serach engines for the FIDIC contracts for construction.',
            ['https://fidic.tips/fidicchatbot/fidicchatbot_logo_16_9_trans_bar.jpg'],
            [
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Overview',
                    value: 'https://fidic.tips/fidicbot'
                },
                {
                    type: ActionTypes.OpenUrl,
                    title: 'Web version',
                    value: 'https://fidic.tips/fidicchatbot'
                },
                {
                    type: ActionTypes.PostBack,
                    title: 'start',
                    value: 'start'
                }
            ]
        );

        await context.sendActivity({ attachments: [cardWelcome] });
    }
        
}

module.exports.QnAMultiturnBot = QnAMultiturnBot;
