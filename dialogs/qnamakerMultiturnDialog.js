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
const DefaultNoAnswer = 'Answer not found. Please submit "start" to start again or "help" for help or a contract shortcut code (e.g., "c1" for Construction 1st Ed 1999; "p1" for Plant & Design-Build 1st Ed 1999)';

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

        this._userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);
        this._userContractAccessor = userState.createProperty('contractName');

        this.addDialog(new WaterfallDialog(QNAMAKER_DIALOG, [
            this.callGenerateAnswerAsync.bind(this),
            this.checkForMultiTurnPrompt.bind(this),
            this.displayQnAResult.bind(this),
            this.changeContract.bind(this)
        ]));

        this.initialDialogId = QNAMAKER_DIALOG;
    }

 
    async callGenerateAnswerAsync(stepContext) {

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

////////////////////////////

        console.log("\n\n82 ..........MULTITURN..............");

        var util = require('util')
        var utilAccessor = util.inspect(this._userProfileAccessor);
        console.log("\n86 MULTITURN this._userProfileAccessor  = " + utilAccessor)

        var JSONstringifythisuserState = JSON.stringify(this._userState);
        console.log ("\nMULTITURN 89 - this._userState = " + JSONstringifythisuserState);

        var gotContract = '';

        //if (JSONstringifythisuserState.indexOf('contractName') != -1){ //got contractName 
            //console.log("98 this._userState.contractName.name = " + this._userState.contractName.name);
            //console.log("99 this._userContractAssessor.contractName.name = " + this._userContractAccessor.contractName.name);

        if (JSONstringifythisuserState.indexOf('cons1',0) != -1){ //cons1 comes from QnAMaker
             gotContract = "c1";
             console.log ("\n106 MULTITURN IN c1");
             } //note no space
             
             else if (JSONstringifythisuserState.indexOf('plant1',0) != -1){ //plant1 comes from QnAMaker
             gotContract = "p1";

             console.log ("\n117 MULTITURN IN p1");
             } //note no space


//change contract if ContractAccessor has been laded at the end of multiturn

        console.log("\nGOT CONTRACT 121 - gotContract-before = " + gotContract); 
        console.log("\nMULTITURN 122 - contractName-before  = " + this._userContractAccessor.contractName)

        //var utilContractAccessor = util.inspect(this._userContractAccessor);
        //console.log("115 utiluserContractAccessor  = " + utilContractAccessor )

        if (this._userContractAccessor.contractName != 'undefined'){
             if (this._userContractAccessor.contractName != gotContract){gotContract = this._userContractAccessor.contractName;}}

        console.log("\nGOT CONTRACT 123 - gotContract-after = " + gotContract);  
        console.log("\nMULTITURN 123 - contractName-after  = " + this._userContractAccessor.contractName)              

        var str = stepContext.context.activity.text;
        console.log ("\n128 str = " + str + '\n.................................................');
     
if (str != 'start')
             {

////seems to work after changing contract

             if (gotContract == 'c1' && (str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1 || str.indexOf('p1',0) != -1)){
                 console.log ("\n133 got c1 str = " + str + '\n');
                 stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';
                 this._userContractAccessor.contractName = 'p1'; //change contract after restart
                 }
                 else if (gotContract == 'p1' && ( str.indexOf('Construction Contract 1st Ed 1999',0) != -1 || str.indexOf('c1',0) != -1)){
                 console.log ("\n138 got p1 str = " + str + '\n');
                 stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';
                 this._userContractAccessor.contractName = 'c1'; //change contract after restart
                 }             
                 else
                 {
                 var strClean = str;   
                 if (isNaN(str)) //keyword
                      {
                      console.log("\n143 keyword str = " + strClean);
 
////Enter contract on clicking start
                
                      if (str.indexOf('Construction Contract',0) != -1)
                          {
                          stepContext.context.activity.text = 'cons1'; //cons1 into userProfile.name
                          this._userContractAccessor.contractName = 'c1'
                          console.log ("148 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                          }
                          else if (str.indexOf('Plant &',0) != -1 )
                          {
                          stepContext.context.activity.text = 'plant1'; //cons1 into userProfile.name
                          this._userContractAccessor.contractName = 'p1'
                          console.log ("153 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                          }
                          else
                          {

                          var posnSpace = strClean.indexOf(' ',0);
                          console.log ("posnSpace =" + posnSpace);

                          var strCon = '';
                          if (posnSpace != -1){strCon = str.substring(0,posnSpace);}
                          if (gotContract == "c1" || gotContract == "p1" ){strCon = gotContract + ":";}
                          console.log ("163 strCon =" + strCon);

                          var strNo = strClean.substring(posnSpace+1,strClean.length);
                          console.log ("166 strNo =" + strNo);

                          var strNoFull = strNo;
                          if (posnSpace != -1){
                              if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                              if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                              if (strNo.length == 5){strNoFull = strNoFull+'.0.0';}
                              }
                          console.log ("174 strNoFull =" + strNoFull);

                          if (strNoFull != '' && (strCon == "c1" || strCon == "p1") ){
                              var strConNoFull = strCon + " " + strNoFull;
                              }
                              else
                              {
                              var strConNoFull = strCon + strNoFull;
                              }

                           console.log("184 strConNoFull = " + strConNoFull);

                           strConNoFull = strConNoFull.replace('.','\/');
                           strConNoFull = strConNoFull.replace('.','\/');
                           strConNoFull = strConNoFull.replace('.','\/');
                           strConNoFull = strConNoFull.replace('.','\/');
                           strConNoFull = strConNoFull.replace('c1 ','c1:');
                           strConNoFull = strConNoFull.replace('p1 ','p1:');

                          console.log("184 A keyword strConNoFull = " + strConNoFull);

                          stepContext.context.activity.text = strConNoFull;

                          console.log ("198 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                          }
                       }

                       else   ///number
                       { 
                       console.log("\n206 A clause number str = " + str);              

                       var strCon = '';
                       if (gotContract == "c1" || gotContract == "p1" ){strCon = gotContract + ":";}
                       console.log ("strCon =" + strCon);

                       var strNo = str.toString();
                       console.log ("209 strNo =" + strNo);

                       var strNoFull = strNo;
                       if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                       if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                       if (strNo.length == 5){strNoFull = strNoFull+'.0.0';}
                       console.log ("215 strNoFull =" + strNoFull);

                       var strConNoFull = strCon + strNoFull;

                       console.log("219 strConNoFull = " + strConNoFull);

                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('c1 ','c1:');
                       strConNoFull = strConNoFull.replace('p1 ','p1:');

                       console.log("229 A keyword strConNoFull = " + strConNoFull);

                       stepContext.context.activity.text = strConNoFull;

                       console.log ("234 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);

                     }
                 }
             }



/////////////////////


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


        var stringifyStepContextContext = JSON.stringify(stepContext.context);

        //console.log ("\nCALLING (stepContext.context) = " + JSON.stringify(stepContext.context));


        var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);

        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;
        stepContext.values[QnAData] = response.answers;

        var result = [];
        if (response.answers.length > 0) {
            result.push(response.answers[0]);
        }

       console.log ("\n279 RESULT = " + JSON.stringify(result)); //id comes back

        stepContext.values[QnAData] = result;

        return await stepContext.next(result);
    }

    async checkForMultiTurnPrompt(stepContext) {
        if (stepContext.result != null && stepContext.result.length > 0) {
  
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

                var message = QnACardBuilder.GetQnAPromptsCard(answer);
                await stepContext.context.sendActivity(message);

                return { status: DialogTurnStatus.waiting };
            }
        }

        return await stepContext.next(stepContext.result);
    }

 
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

        return await stepContext.next();//mine

        }

//////mine

    }

    async changeContract(stepContext, userState) { 

       console.log("\n\n371 ..........SAVE..............");

       var currentQuery = stepContext._info.values.currentQuery;
       var currentPosn = currentQuery.indexOf(':',0);
       
       var currentContract = currentQuery.substring(0, currentPosn); 

       console.log("\n378 currentQuery  = " + currentQuery);
       console.log("\n379 currentContract  = " + currentContract + "\n");

       this._userContractAccessor = this._userState.createProperty('contractName'); 

       //var util = require('util')
       //var utilInspectstepContext = util.inspect(stepContext);
       //console.log("\nutilInspectstepContext  = " + utilInspectstepContext )
       //console.log("this._userState.storage.memory.dialogStack  = " + JSON.stringify(this._userState.storage.memory.dialogStack) )
       //this._userProfileAccessor = this._userState.createProperty('contractName'); //OK
       //var util = require('util')
       //var utilProfileAccessor = util.inspect(this._userProfileAccessor);
       //console.log("373 utiluserProfileAccessor  = " + utilProfileAccessor )
       //var utilContractAccessor = util.inspect(this._userContractAccessor);
       //console.log("390 utiluserContractAccessor  = " + utilContractAccessor )
       //console.log("\n379 SAVE- ProfileAccessor.contractName  = " + this._userProfileAccessor.contractName )
       //this.userState = userState;
       //await stepContext.sendActivity('Thanks.To see conversation data, type anything.');
       //userProfile = await this._userProfileAccessor.get(stepContext, {});
       ////userProfile.name = stepContext.activity.text;
       ////await this._userState.saveChanges(stepContext, false);//MINE
       //var utilAccessor = util.inspect(this._userContractAccessor);
       //console.log("utilAccessorBBBB  = " + utilAccessor )
      
       console.log("\n400 ContractAccessor.contractName  = " + this._userContractAccessor.contractName )

       this._userContractAccessor.contractName = currentContract;



/////end mine

        return await stepContext.endDialog(); //orig

        } //mine

    //} orig

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

