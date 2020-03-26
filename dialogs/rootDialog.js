// Copyright (c) Bricad Associates 2020

// ver 2 March 2020 _TESTING2

const ROOTDIALOG = 'ROOTDIALOG';

const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const {
    QnAMakerMultiturnDialog,
    QNAMAKER_MULTITURN_DIALOG,
    DefaultCardNoMatchResponse,
    DefaultCardNoMatchText,
    DefaultCardTitle,
    DefaultNoAnswer,
    DefaultThreshold,
    DefaultTopN,
    QnAOptions,
    QnADialogResponseOptions
} = require('./qnamakerMultiturnDialog');

const INITIAL_DIALOG = 'initial-dialog';
const ROOT_DIALOG = 'root-dialog';

class RootDialog extends ComponentDialog {

    constructor(qnaService, userState,conversationState) {  //userState and conversationState added
        super(ROOT_DIALOG);

        this.addDialog(new WaterfallDialog(INITIAL_DIALOG, [
            this.startInitialDialog.bind(this)
        ]));

        this.addDialog(new QnAMakerMultiturnDialog(qnaService,userState,conversationState)); //userState and conversationState added

        this.initialDialogId = INITIAL_DIALOG;
    }


    async run(context, accessor) {

        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }


    async startInitialDialog(step) {

        var qnamakerOptions = {
            scoreThreshold: DefaultThreshold,
            top: DefaultTopN,
            context: {}
        };


        var qnaDialogResponseOptions = {
            noAnswer: DefaultNoAnswer,
            activeLearningCardTitle: DefaultCardTitle,
            cardNoMatchText: DefaultCardNoMatchText,
            cardNoMatchResponse: DefaultCardNoMatchResponse

        };


        var dialogOptions = {};
        dialogOptions[QnAOptions] = qnamakerOptions;
        dialogOptions[QnADialogResponseOptions] = qnaDialogResponseOptions;

        return await step.beginDialog(QNAMAKER_MULTITURN_DIALOG, dialogOptions); 
    }
}

module.exports.RootDialog = RootDialog;
module.exports.ROOTDIALOG = ROOTDIALOG;//added

