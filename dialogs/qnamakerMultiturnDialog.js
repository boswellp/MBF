// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ComponentDialog,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { QnACardBuilder } = require('../utils/qnaCardBuilder');

// Default parameters
const DefaultThreshold = 0.3;
const DefaultTopN = 3;
const DefaultNoAnswer = 'Answer not found. Please submit "start" to start again or "help" for help or a contract shortcut code (e.g., "c1" for Construction 1st Ed 1999; "p1" for Plant 1st Ed 1999)';

// Card parameters
const DefaultCardTitle = 'Did you mean:';
const DefaultCardNoMatchText = 'None of the above.';
const DefaultCardNoMatchResponse = 'Thanks for the feedback.';

// Define value names for values tracked inside the dialogs.
const QnAOptions = 'qnaOptions';
const QnADialogResponseOptions = 'qnaDialogResponseOptions';
const CurrentQuery = 'currentQuery';
const QnAData = 'qnaData';
const QnAContextData = 'qnaContextData';
const PreviousQnAId = 'prevQnAId';

/// QnA Maker dialog.
const QNAMAKER_DIALOG = 'qnamaker-dialog';
const QNAMAKER_MULTITURN_DIALOG = 'qnamaker-multiturn-dailog';
const USER_PROFILE_PROPERTY = 'userProfile';

class QnAMakerMultiturnDialog extends ComponentDialog {
    /**
     * Core logic of QnA Maker dialog.
     * @param {QnAMaker} qnaService A QnAMaker service object.
     */
    //constructor(qnaService) { //ORIG
    constructor(qnaService,userState) { //ORIG
        super(QNAMAKER_MULTITURN_DIALOG);

        this._qnaMakerService = qnaService;
        this._userState = userState;

        console.log("..............this._userState = " + JSON.stringify(this._userState));

        this.addDialog(new WaterfallDialog(QNAMAKER_DIALOG, [
            this.callGenerateAnswerAsync.bind(this),
            this.checkForMultiTurnPrompt.bind(this),
            this.displayQnAResult.bind(this)
        ]));

        this.initialDialogId = QNAMAKER_DIALOG;
    }

    /**
    * @param {WaterfallStepContext} stepContext contextual information for the current step being executed.
    */
    async callGenerateAnswerAsync(stepContext) {
        // Default QnAMakerOptions
        var qnaMakerOptions = {
            scoreThreshold: DefaultThreshold,
            top: DefaultTopN,
            context: {},
            qnaId: -1
        };

        var dialogOptions = getDialogOptionsValue(stepContext);

        if (dialogOptions[QnAOptions] != null) {
            qnaMakerOptions = dialogOptions[QnAOptions];
            qnaMakerOptions.scoreThreshold = qnaMakerOptions.scoreThreshold ? qnaMakerOptions.scoreThreshold : DefaultThreshold;
            qnaMakerOptions.top = qnaMakerOptions.top ? qnaMakerOptions.top : DefaultThreshold;
        }

        // Storing the context info


  
////////////////////////
/*

             str = JSON.stringify(stepContext.context.activity.text);
             str = str.replace('-','\/');
             str = str.replace(' ','\/');
       
             stepContext.context.activity.text = str;


       //console.log("..............stepContext.context.activity.text = " + JSON.stringify(stepContext.context.activity.text));
      //var userStateStringify = JSON.stringify(this._userState)

      //console.log("..............userStateStringify = " + userStateStringify);
      //console.log("..............this._userState.storage = " + JSON.stringify(this._userState.storage));
      //console.log("..............this._userState.storage.memory.context = " + JSON.stringify(this._userState.storage.memory.context));

      if (userStateStringify.indexOf('construction contract') > 0){

             console.log("..............CONSTRUCTION");

             //str = str.replace('c1 ','');
             //stepContext.context.activity.text = str;

             if (str.indexOf('c1') == -1){ 

                   //str = str.replace('-','\/');
                   //str = str.replace(' ','\/');
       
                   stepContext.context.activity.text = 'c1:' + str; //if only a number add c1 to activity

                   }

               }

        if (userStateStringify.indexOf('plant & design-build contract') > 0){

             console.log("..............PLANT");

             //str = str.replace('c1 ','');
             //stepContext.context.activity.text = str;

             if (str.indexOf('p1') == -1){ 

                   //str = str.replace('-','\/');
                   //str = str.replace(' ','\/');
                   stepContext.context.activity.text = 'p1:' + str; //if only a number add p1 to activity
                   }
               }



        //console.log("input str = " +str);

        if (str.indexOf('c1') == -1){

             str = str.replace('-','\/');  //WORKS
        
             str = str.replace('.','/');  //Not work

             str = str.replace(' ','\/');  //WORKS

             console.log(str);

             //stepContext.context.activity.text = 'c1:' + str;
             }

        //console.log(JSON.stringify(stepContext.context.activity.text));


//////////////////////
*/

        stepContext.values[CurrentQuery] = stepContext.context.activity.text;


        var previousContextData = dialogOptions[QnAContextData];
        var prevQnAId = dialogOptions[PreviousQnAId];

        if (previousContextData != null && prevQnAId != null) {
            if (prevQnAId > 0) {
                qnaMakerOptions.context = {
                    previousQnAId: prevQnAId
                };
                
                qnaMakerOptions.qnaId = 0;
                if (previousContextData[stepContext.context.activity.text.toLowerCase()] !== null) {
                    qnaMakerOptions.qnaId = previousContextData[stepContext.context.activity.text.toLowerCase()];
                }
            }
        }

        // Calling QnAMaker to get response.


///////////////////mine

            //console.log (".............FOR STORAGE0 (GET)");
            //this.userProfileAccessor = this._userState.createProperty(USER_PROFILE_PROPERTY);
            //const userProfile = await this.userProfileAccessor.get(stepContext, {});
            //const userProfile = this.userProfileAccessor.get(stepContext, {}); //WORKS
            //const userProfile = this.userProfileAccessor.get(stepContext);
            //console.log (".............FOR STORAGE0 (userProfile) = " + userProfile);
            //console.log (".............FOR STORAGE0 (userProfile.name) = " + userProfile.name);
            //console.log (".............FOR STORAGE0 (JSON.stringify(userProfile)) = " + JSON.stringify(userProfile));

        //var str = JSON.stringify(stepContext.context.activity.text);
        var str = stepContext.context.activity.text;

        if (str != '"start"')
             {
             var strClean = str.replace('-','.');
             strClean = str.replace(' ','.');
             strClean = str.replace('c1:','');
             strClean = str.replace('p1:','');
             console.log (".............FOR STORAGE0 (isNaN = " + strClean + ")) = " + isNaN(strClean));
             if (isNaN(strClean)) //clause number or keyword
                 {
                 console.log("A keyword str = " + str);

                 var util = require('util')
                 var utilInspectStepContext = util.inspect(stepContext);
                 var prevQnAId = stepContext._info.options.prevQnAId;
                 console.log("prevQnAId = " + prevQnAId);



                 if (parseInt(prevQnAId, 10) < 1019 && str.indexOf("c1i") == -1 && str.indexOf("p1") == -1){  //construction in knowledgebase excel and allows contract change
                    stepContext.context.activity.text = 'c1i ' + str;
                    } 
                 if (parseInt(prevQnAId, 10) > 1019 && str.indexOf("p1i") == -1 && str.indexOf("c1") == -1){  //plant in knowledgebase excel and allows contract change
                    stepContext.context.activity.text = 'p1i ' + str;
                    }
                 }

                 else
                 { 

                 console.log("A clause number str = " + str);              

                 var util = require('util')
                 var utilInspectStepContext = util.inspect(stepContext);
                 var prevQnAId = stepContext._info.options.prevQnAId;
                 console.log("prevQnAId = " + prevQnAId);

                 //if (util.inspec.contains('PrevQnAId: 747'))  //this is Construction
                 str = str.replace('-','\/');
                 str = str.replace('.','\/');
                 str = str.replace(' ','\/');
                 if (prevQnAId == 'undefined' && str == 'c1'){ //change contract
                    stepContext.context.activity.text = 'c1';}
                 if (parseInt(prevQnAId, 10) < 1019 && str.indexOf("c1") == -1){  //construction in knowledgebase excel
                    stepContext.context.activity.text = 'c1:' + str;} 

                 if (prevQnAId == 'undefined' && str == 'p1'){ //change contract
                    stepContext.context.activity.text = 'p1';}
                 if (parseInt(prevQnAId, 10) > 1019 && str.indexOf("p1") == -1){  //plant in knowledgebase excel
                    stepContext.context.activity.text = 'p1:' + str;}

                 }
             }

            //console.log("..............\n.............FOR STORAGE0 (stepContext._info.options.prevQnAId) = " +  stepContext._info.options.prevQnAId);

            //var responsePrevQnAId = await this._qnaMakerService.getAnswersRaw(prevQnAId, qnaMakerOptions);
            //console.log (".............CALLING PREV (responsePrevQnAId = " + prevQnAId + ") = " + JSON.stringify(responsePrevQnAId));








        //var objStringify = JSON.stringify(this.userProfileAccessor);
        //console.log (".............FOR STORAGE0 (objStringify.userProfile) = " + objStringify.userProfile);


/*

       if (objStringify.includes("xxx")) //c1 input. Need to save this
            {        
            console.log (".............this.userProfileAccessor c1 input");

            var str = JSON.stringify(stepContext.context.activity.text);
            if (str.indexOf('c1') == -1){ //no c1, replace 

                   //str = str.replace('-','\/');
                   //str = str.replace(' ','\/');
                   str = str.replace('p','c');
       
                   stepContext.context.activity.text = str;

                   }

            }

//https://stackoverflow.com/questions/11616630/how-can-i-print-a-circular-structure-in-a-json-like-format


        //var util = require('util')
        //console.log(util.inspect(stepContext))
        //userProfile.name = stepContext.activity.text;
        ///userProfile.name has "Construction Contract"
        //console.log (".............calling userProfile.name = " + JSON.stringify(userProfile.name));

/////////////////end mine
*/

        var stringifyStepContextContext = JSON.stringify(stepContext.context);

        //console.log (".............CALLING (QnAMaker stepContext.context) = " + stringifyStepContextContext);


        var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);

        // Resetting previous query.
        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;

        // Take this value from GetAnswerResponse.
        stepContext.values[QnAData] = response.answers;

        var result = [];
        if (response.answers.length > 0) {
            result.push(response.answers[0]);
        }

       //console.log ("..............RESULT (qnaMultiTurndialog) = " + JSON.stringify(result));

        stepContext.values[QnAData] = result;

        return await stepContext.next(result);
    }

    /**
    * @param {WaterfallStepContext} stepContext contextual information for the current step being executed.
    */
    async checkForMultiTurnPrompt(stepContext) {
        if (stepContext.result != null && stepContext.result.length > 0) {
            // -Check if context is present and prompt exists.
            // -If yes: Add reverse index of prompt display name and its corresponding qna id.
            // -Set PreviousQnAId as answer.Id.
            // -Display card for the prompt.
            // -Wait for the reply.
            // -If no: Skip to next step.

            var answer = stepContext.result[0];

            if (answer.context != null && answer.context.prompts != null && answer.context.prompts.length > 0) {
                var dialogOptions = getDialogOptionsValue(stepContext);

                var previousContextData = {};

                if (!!dialogOptions[QnAContextData]) {
                    previousContextData = dialogOptions[QnAContextData];
                }

                answer.context.prompts.forEach(prompt => {
                    previousContextData[prompt.displayText.toLowerCase()] = prompt.qnaId;
                });

                dialogOptions[QnAContextData] = previousContextData;
                dialogOptions[PreviousQnAId] = answer.id;
                stepContext.activeDialog.state.options = dialogOptions;

                // Get multi-turn prompts card activity.
                var message = QnACardBuilder.GetQnAPromptsCard(answer);
                await stepContext.context.sendActivity(message);

                return { status: DialogTurnStatus.waiting };
            }
        }

        return await stepContext.next(stepContext.result);
    }

    /**
    * @param {WaterfallStepContext} stepContext contextual information for the current step being executed.
    */
    async displayQnAResult(stepContext) {
        var dialogOptions = getDialogOptionsValue(stepContext);
        var qnaDialogResponseOptions = dialogOptions[QnADialogResponseOptions];

        var reply = stepContext.context.activity.text;

        if (reply === qnaDialogResponseOptions.cardNoMatchText) {
            await stepContext.context.sendActivity(qnaDialogResponseOptions.cardNoMatchResponse);
            return await stepContext.endDialog();
        }

        var previousQnAId = dialogOptions[PreviousQnAId];
        if (previousQnAId > 0) {
            return await stepContext.replaceDialog(QNAMAKER_DIALOG, dialogOptions);
        }

        var responses = stepContext.result;
        if (responses != null) {
            if (responses.length > 0) {
                await stepContext.context.sendActivity(responses[0].answer);
            } else {
                await stepContext.context.sendActivity(qnaDialogResponseOptions.noAnswer);
            }
        }

        return await stepContext.endDialog();
    }
}

function getDialogOptionsValue(dialogContext) {
    var dialogOptions = {};

    if (dialogContext.activeDialog.state.options !== null) {
        dialogOptions = dialogContext.activeDialog.state.options;
    }

    return dialogOptions;
}

module.exports.QnAMakerMultiturnDialog = QnAMakerMultiturnDialog;
module.exports.QNAMAKER_MULTITURN_DIALOG = QNAMAKER_MULTITURN_DIALOG;
module.exports.DefaultThreshold = DefaultThreshold;
module.exports.DefaultTopN = DefaultTopN;
module.exports.DefaultNoAnswer = DefaultNoAnswer;
module.exports.DefaultCardTitle = DefaultCardTitle;
module.exports.DefaultCardNoMatchText = DefaultCardNoMatchText;
module.exports.DefaultCardNoMatchResponse = DefaultCardNoMatchResponse;
module.exports.QnAOptions = QnAOptions;
module.exports.QnADialogResponseOptions = QnADialogResponseOptions;
