// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ComponentDialog,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { QnACardBuilder } = require('../utils/qnaCardBuilder');

// Default parameters
const DefaultThreshold = 0.90;
const DefaultTopN = 3;
const DefaultNoAnswer = 'Answer not found. Please submit "start" to start again, "help" for help or a contract code (e.g., "c1" for Construction 1st Ed 1999). Or submit a clause number (e.g., "4.2") or a keyword (e.g., "agreement") to search the index.';

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
const USER_PROFILE_PROPERTY = 'userProfile'; //MINE ADDED

class QnAMakerMultiturnDialog extends ComponentDialog {
    /**
     * Core logic of QnA Maker dialog.
     * @param {QnAMaker} qnaService A QnAMaker service object.
     */
    //constructor(qnaService) {  //ORIG
    constructor(qnaService,userState) { //MINE
        super(QNAMAKER_MULTITURN_DIALOG);

        this._qnaMakerService = qnaService;
        
        this._userState = userState; //MINE ADDED
        this._userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY); //MINE ADDED

        this.addDialog(new WaterfallDialog(QNAMAKER_DIALOG, [
            this.callGenerateAnswerAsync.bind(this),
            this.checkForMultiTurnPrompt.bind(this),
            this.displayQnAResult.bind(this),
            this.changeContract.bind(this) //MINE ADDED
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
        
        //////////////////////////////////////////MINE
        
                console.log("\n\n78 ..........MULTITURN..............");

        var util = require('util')
        //console.log("\n85 MULTITURN this._userProfileAccessor  = " + util.inspect(this._userProfileAccessor))
        //console.log("\n86 MULTITURN this._userContractAccessor  = " + util.inspect(this._userContractAccessor))

        var JSONstringifythisuserState = JSON.stringify(this._userState);
        //console.log ("\n89 MULTITURN this._userState = " + JSONstringifythisuserState);

 
        if (this._userProfileAccessor.profileName == 'undefined' && JSONstringifythisuserState.indexOf('cons1',0) != -1) //cons1 comes from QnAMaker and not got profileName
             {
             this._userProfileAccessor.profileName = "c1";
             console.log ("\n90 MULTITURN cons1 from QnAMaker IN c1");
             //var utilProfileAccessor = util.inspect(this._userProfileAccessor);
             //console.log("96 utiluserProfileAccessor  = " + utilProfileAccessor )
             } 
             else if (JSONstringifythisuserState.indexOf('plant1',0) != -1){ //plant1 comes from QnAMaker
             this._userProfileAccessor.profileName = "p1";
             console.log ("\n95 MULTITURN plant1 from QnAMake IN p1");
             } 


        var gotContract = '';
        gotContract = this._userProfileAccessor.profileName;

        console.log("\n103 MULTITURN profileName  = " + this._userProfileAccessor.profileName)

        var str = stepContext.context.activity.text;

        console.log ("\n108 str = " + str + '; gotContract = ' + gotContract +'\n.................................................');
     
        if (str != 'start')
             {
             console.log ("\n112 IN str = " + str);

             if ((gotContract != '' && str == 'c1i') || (gotContract != '' && str == 'c1 i'))  //INDEX c1 i button or c1i typed in
                 {
                 console.log ("\n113 button c1 i or typed c1i str = " + str + '\n');
                 stepContext.context.activity.text = 'c1i:0/0/0/0';
                 this._userProfileAccessor.profileName = 'c1i';
                 }


                 else if ((gotContract != '' && str == 'p1i') || (gotContract != '' && str == 'p1 i'))  //INDEX c1 i button or c1i typed in
                 {
                 console.log ("\n121 button p1 i or typed p1i str = " + str + '\n');
                 stepContext.context.activity.text = 'p1i:0/0/0/0';
                 this._userProfileAccessor.profileName = 'p1i';
                 }

                 else if (gotContract == 'c1' && str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1)
                 {
                 console.log ("\n128 got c1 str = " + str + '\n');
                 stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';
                 this._userProfileAccessor.profileName = 'p1'; //change contract after restart
                 }

                 else if (gotContract == 'p1' && str.indexOf('Construction Contract 1st Ed 1999',0) != -1)
                 {
                 console.log ("\n135 got p1 str = " + str + '\n');
                 stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';
                 this._userProfileAccessor.profileName = 'c1'; //change contract after restart
                 } 
                       
                 else

                 {
                 
                 var strClean = str; 
                 console.log ("\n148 IN strClean = " + strClean);  

                 if (isNaN(str)) //keyword
                      {
                      var contractCode = this._userProfileAccessor.profileName;
                      console.log("\n153 keyword str = " + strClean + '; contractCode = ' + contractCode);
 
                      ////Enter contract on clicking start

                      if (str.indexOf('Construction Contract',0) != -1)
                          {
                          stepContext.context.activity.text = 'cons1'; //cons1 into userProfile.name
                          this._userProfileAccessor.profileName = 'c1'
                          console.log ("155 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                          }
                          else if (str.indexOf('Plant &',0) != -1 )
                          {
                          stepContext.context.activity.text = 'plant1'; //cons1 into userProfile.name
                          this._userProfileAccessor.profileName = 'p1'
                          console.log ("167 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                          }


                     
                      else if (str == 'c1i' || str == 'p1i')//INDEX
                              {
                              if (str != this._userProfileAccessor.profileName) //changing index for c1i to p1i
                                  {
                                  this._userProfileAccessor.profileName = str + ':0/0/0/0';
                                  stepContext.context.activity.text = str;
                                  console.log ("181 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                  }
                              }


                      else if (contractCode != undefined)
                              {
                              if ((contractCode.indexOf('1i',0) != -1 && str == 'c1') || (contractCode.indexOf('1i',0) != -1 && str == 'p1')) //leave index
                                   {  
                                  stepContext.context.activity.text = str;
                                  this._userProfileAccessor.profileName = str; //change index to c1, p1
                                  console.log ("192 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                  }
                                  else if (contractCode.indexOf('1i',0) != -1) //got contact code + str
                                  {
                                  stepContext.context.activity.text = contractCode + ':' + str;
                                  console.log ("197 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                  }
                              }


                       else
                             {
                             console.log("\n196 keyword strClean = " + strClean + '; contractCode = ' + contractCode);
                             var posnSpace = strClean.indexOf(' ',0);
                             console.log ("198 posnSpace =" + posnSpace);

                             var strCon = str;
                             if (posnSpace != -1){strCon = str.substring(0,posnSpace);}
                             console.log ("202 strCon =" + strCon);

                             if (strCon == "c1" || strCon == "p1" )
                                 {
                                 this._userProfileAccessor.profileName = strCon;
                                 console.log("\n219 profileName = " + this._userProfileAccessor.profileName)
                                 strCon = strCon + ":";
                                 console.log ("221 strCon =" + strCon);
                                 }

                             var strNo ='';
                             if (posnSpace != -1)  //one word
                                 {
                                 var strNo = strClean.substring(posnSpace+1,strClean.length);
                                 }
                                console.log ("226 strNo =" + strNo);

                             var strNoFull = strNo;
                             if (posnSpace != -1)
                                 {
                                 if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                                 if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                                 if (strNo.length == 5){strNoFull = strNoFull+'.0.0';}
                                 }
                             console.log ("226 strNoFull =" + strNoFull);

                             if (str =='c1' || str == 'p1')
                                 {
                                 strConNoFull = str;
                                 }
                                 else if (strNoFull != '' && (strCon == "c1" || strCon == "p1") )
                                    {
                                    var strConNoFull = strCon + " " + strNoFull;
                                    }
                                 else
                                    {
                                    var strConNoFull = strCon + strNoFull;
                                    }

                                    console.log("241 strConNoFull = " + strConNoFull);

                                    strConNoFull = strConNoFull.replace('.','\/');
                                    strConNoFull = strConNoFull.replace('.','\/');
                                    strConNoFull = strConNoFull.replace('.','\/');
                                    strConNoFull = strConNoFull.replace('.','\/');
                                    strConNoFull = strConNoFull.replace('c1 ','c1:');
                                    strConNoFull = strConNoFull.replace('p1 ','p1:');

                                    if (strNo == '' && strConNoFull != 'c1' && strConNoFull != 'p1' && strConNoFull != 'c1i' && strConNoFull != 'p1i' && strConNoFull != 'help' && strConNoFull != 'start') 
                                        {
                                        if (strConNoFull == 'c1'){strConNoFull = 'c1i:' + strConNoFull;}
                                        if (strConNoFull == 'p1'){strConNoFull = 'p1i:' + strConNoFull;}
                                        }

                                    console.log("255 A keyword strConNoFull = " + strConNoFull);

                                    stepContext.context.activity.text = strConNoFull;

                                    console.log ("259 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                                     }
                               }
                          }
                     }
  
                console.log ("268 str = " + str);
                    

                 if (str != 'start' && !isNaN(str)) ///number
                       { 
                       console.log("\n273 A clause number str = " + str);              

                       var strCon = '';


                       if (this._userProfileAccessor.profileName == "c1" || this._userProfileAccessor.profileName == "p1" )
                             {
                             console.log("\n282 profileName = " + this._userProfileAccessor.profileName)
                             strCon = this._userProfileAccessor.profileName + ":";
                             console.log ("284 strCon =" + strCon);
                             }


                       var strNo = str.toString();
                       console.log ("289 strNo =" + strNo);

                       var strNoFull = strNo;
                       if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                       if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                       if (strNo.length == 5){strNoFull = strNoFull+'.0.0';}
                       console.log ("295 strNoFull =" + strNoFull);

                       var strConNoFull = strCon + strNoFull;

                       console.log("299 strConNoFull = " + strConNoFull);

                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('.','\/');
                       strConNoFull = strConNoFull.replace('c1 ','c1:');
                       strConNoFull = strConNoFull.replace('p1 ','p1:');

                       console.log("308 A keyword strConNoFull = " + strConNoFull);

                       stepContext.context.activity.text = strConNoFull;

                       console.log ("312 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);

                       }
        
        //////////////////////////////////////////END MINE

        // Storing the context info
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
            
            return await stepContext.next();//MINE ADDED
        }

        //return await stepContext.endDialog(); //ORIG
    //} //ORIG
    
//////MINE
    
}

async changeContract(stepContext, userState) { 

       console.log("\n\n363 ..........SAVE..............");

       var currentQuery = stepContext._info.values.currentQuery;
       var currentPosn = currentQuery.indexOf(':',0);
       
       var currentContract = currentQuery.substring(0, currentPosn); 

       console.log("\n393 currentQuery  = " + currentQuery);
       console.log("\n394 currentContract  = " + currentContract + "\n");

       console.log("\n396 ProfileAccessor.profileName - before  = " + this._userProfileAccessor.profileName);

       this._userProfileAccessor.profileName = currentContract.replace('1i','1'); //NOTE c1i deactivated for index search

       console.log("\n400 ProfileAccessor.profileName - after = " + this._userProfileAccessor.profileName);



/////END MINE

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

