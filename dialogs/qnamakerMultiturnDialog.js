// Copyright (c) Bricad Associates 2020

// ver 21mar20 _TESTING2

//alterations use: qnamaker replace alterations --in wordAlterations.json

var categoriesAry = ["agreement","certificate","clause","condition","contractor","dab","defect","definition","document","duty","employer","engineer","equipment","failure","force-majeure","instruction","insurance","measure","obligation","part","particular","payment","personnel","programme","security","site","subcontract","suspension","taking-over","termination","test","time","value","variation"];

const {
    ComponentDialog,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { InputHnts } = require('botbuilder'); //added

const { QnACardBuilder } = require('../utils/qnaCardBuilder');

const { QnAMaker } = require('botbuilder-ai'); 

const DefaultThreshold = 0.5;
const DefaultTopN = 3;
const DefaultRankerType = '';
//const DefaultStrictFilters = [{name:'',value:''}];
//const DefaultStrictFilters = null;

const DefaultNoAnswer = 'Answer not found. Please submit "start" to start again, "help" for help or a contract code (e.g., "c1" for Construction 1st Ed 1999). Or submit a clause number (e.g., "4.2") or a keyword (e.g., "agreement") to search the index.';

const DefaultCardTitle = 'Did you mean:';
const DefaultCardNoMatchText = 'None of the above.';
const DefaultCardNoMatchResponse = 'Thanks for the feedback.';

const QnAOptions = 'qnaOptions';
const QnADialogResponseOptions = 'qnaDialogResponseOptions';
const CurrentQuery = 'currentQuery';
const QnAData = 'qnaData';
const QnAContextData = 'qnaContextData';
const PreviousQnAId = 'prevQnAId';

const QNAMAKER_DIALOG = 'qnamaker-dialog';
const QNAMAKER_MULTITURN_DIALOG = 'qnamaker-multiturn-dailog';
const USER_PROFILE_PROPERTY = 'userProfileAccessor';
const USER_SEARCH_PROPERTY = 'userSearchAccessor'; 
//const USER_STRING_VALUE = 'stringValue';
const USER_STRING_PROPERTY = 'userStringAccessor';
const WELCOMED_USER = 'welcomedUserProperty';
//const WELCOMED_USER_STATUS = 'welcomedStatus';
//const CONVERSATION_DATA_PROPERTY = 'conversationData'; 


class QnAMakerMultiturnDialog extends ComponentDialog {
   
    constructor(userState,conversationState) { 
 

        super(QNAMAKER_MULTITURN_DIALOG);


/*
var endpointHostName = process.env.QnAEndpointHostName;
if (!endpointHostName.startsWith('https://')) {
    endpointHostName = 'https://' + endpointHostName;
}

if (!endpointHostName.endsWith('/qnamaker')) {
    endpointHostName = endpointHostName + '/qnamaker';
}


this._userKBAccessor = userState.createProperty('kB'); 
this._userKBAccessor = 'c1'; 
console.log(".............................................................\nChange knowledge base = " +             this._userKBAccessor.kB)
*/


const qnaService = new QnAMaker({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    endpointKey: process.env.QnAEndpointKey,
    host: process.env.QnAEndpointHostName
    });


   

        this._qnaMakerService = qnaService;
        this._userState = userState; 
        this._conversationState = conversationState;
        this._userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY); 
        this._userSearchAccessor = userState.createProperty(USER_SEARCH_PROPERTY); 
        //this._userStringAccessor = userState.createProperty(USER_STRING_VALUE);
        this._userStringAccessor = userState.createProperty(USER_STRING_PROPERTY);
        this._welcomedUserProperty = userState.createProperty(WELCOMED_USER); 
        //this._userWelcomeAccessor = userState.createProperty(WELCOMED_USER_STATUS);  

        this.addDialog(new WaterfallDialog(QNAMAKER_DIALOG, [
            this.callGenerateAnswerAsync.bind(this),
            this.checkForMultiTurnPrompt.bind(this),
            this.displayQnAResult.bind(this),
            this.changeContract.bind(this) 
        ]));

        this.initialDialogId = QNAMAKER_DIALOG;
    }

    async callGenerateAnswerAsync(stepContext) {
        // Default QnAMakerOptions
        var qnaMakerOptions = {
            scoreThreshold: DefaultThreshold,
            top: DefaultTopN,
            //strictFilters: DefaultStrictFilters,  
            rankerType: DefaultRankerType,
            context: {},
            qnaId: -1
        };

        var dialogOptions = getDialogOptionsValue(stepContext);

        if (dialogOptions[QnAOptions] != null) {
            qnaMakerOptions = dialogOptions[QnAOptions];
            qnaMakerOptions.scoreThreshold = qnaMakerOptions.scoreThreshold ? qnaMakerOptions.scoreThreshold : DefaultThreshold;
            qnaMakerOptions.top = qnaMakerOptions.top ? qnaMakerOptions.top : DefaultThreshold;
        }

        //const didBotWelcomedUser = this._welcomedUserProperty.welcomedUserProperty;


var userProfile = await this._userProfileAccessor.get(stepContext.context,false)
console.log("\n128 userProfile = " + userProfile);
//if (this._userProfileAccessor.profileName != undefined)
if (userProfile != false)
    {
    //if (this._userProfileAccessor.profileName.indexOf('p1',0) != -1){
    if (userProfile.indexOf('p1',0) != -1){

        console.log(".............................................................\n In dialog change knowledge base..p1")         

        const qnaService = new QnAMaker({
        knowledgeBaseId: process.env.QnAKnowledgebaseIdp1,
        endpointKey: process.env.QnAEndpointKey,
        host: process.env.QnAEndpointHostName
        });

        } else {

        console.log(".............................................................\n In dialog change knowledge base..other")         

        const qnaService = new QnAMaker({
        knowledgeBaseId: process.env.QnAKnowledgebaseId,
        endpointKey: process.env.QnAEndpointKey,
        host: process.env.QnAEndpointHostName
        });

        }
        
     } else {
         
     console.log(".............................................................\n In dialog change knowledge base..other for undefined")         

     const qnaService = new QnAMaker({
     knowledgeBaseId: process.env.QnAKnowledgebaseId,
     endpointKey: process.env.QnAEndpointKey,
     host: process.env.QnAEndpointHostName
     });
         
         
         
         
         
}





     
        console.log("\n\n117 .......MULTITURN......");


        //console.log ("\n125 this._userState = " + JSON.stringify(this._userState));

        //console.log("\n\n125 this._welcomedUserProperty = " + JSON.stringify(this._welcomedUserProperty))
        //this._userWelcomeAccessor.welcomedStatus = null;

        //console.log("\n\n129 this._welcomedUserProperty = " + JSON.stringify(this._welcomedUserProperty));

        //console.log("\n\n125 this._userState.storage.memory = " + JSON.stringify(this._userState.storage.memory));

        //console.log("\n\n129 this._userWelcomeAccessor.welcomedStatus = " + JSON.stringify(this._userWelcomeAccessor.welcomedStatus));

        //console.log ("\n131 this._welcomedUserProperty = " + JSON.stringify(this._welcomedUserProperty));

        //console.log ("\n133 this._welcomedUserProperty.welcomedUserProperty = " + JSON.stringify(this._welcomedUserProperty.welcomedUserProperty));


        if (this._welcomedUserProperty != undefined && stepContext != undefined){
            const didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
            console.log ("\n192 didBotWelcomedUser  = " + didBotWelcomedUser);
            }


        console.log("\n\n145 .......MULTITURN END......");


        var util = require('util')
        //console.log("\n126  stepContext  = " + util.inspect(stepContext))
        //console.log("\n128 this._userContractAccessor  = " + util.inspect(this._userContractAccessor))

        var JSONstringifythisuserState = JSON.stringify(this._userState);

       // var utilInspectstepContext = util.inspect(stepContext);

        var userProfile = await this._userProfileAccessor.get(stepContext.context,false)
        ////if (this._userProfileAccessor.profileName == undefined && JSONstringifythisuserState.indexOf('cons1',0) != -1) //cons1 comes from QnAMaker and not got profileName
        if (userProfile != false && JSONstringifythisuserState.indexOf('cons1',0) != -1) //cons1 comes from QnAMaker and not got profileName
             {
             ////this._userProfileAccessor.profileName = "c1";
             await this._userProfileAccessor.set(stepContext.context, "c1");
             //this._userSearchAccessor.searchType = "index";
             await this._userSearchAccessor.set(stepContext.context, "index");
             console.log ("\n227 MULTITURN cons1 from QnAMaker IN c1");
             //var utilProfileAccessor = util.inspect(this._userProfileAccessor);
             //console.log("119 utiluserProfileAccessor  = " + utilProfileAccessor )
             } 
             else if (JSONstringifythisuserState.indexOf('plant1',0) != -1){ //plant1 comes from QnAMaker
             ////this._userProfileAccessor.profileName = "p1";
             await this._userProfileAccessor.set(stepContext.context, "p1");
             //this._userSearchAccessor.searchType = "index";
             await this._userSearchAccessor.set(stepContext.context, "index");
             console.log ("\n234 MULTITURN plant1 from QnAMake IN p1");
             } 

///need to check str

         var str = stepContext.context.activity.text;
         //this._userStringAccessor.stringValue = str;
         var profileName = await this._userProfileAccessor.get(stepContext.context,false)




         //console.log ("\n152 str = " + str + "; profileNameSTORED = " + profileName + "; searchTypeSTORED = " + this._userSearchAccessor.searchType);
     
         console.log ("\n157 IN str = " + str);

             //SEARCH
             if ((profileName != '' && str == 'c1s') || (profileName != '' && str == 'c1 s')) 
 
                   //INDEX c1 i button or c1i typed in
                   {
                   console.log ("\n164 button c1 s or typed c1s str = " + str + '\n');
                   stepContext.context.activity.text = 'c1s:0/0/0/0';
                   ////this._userProfileAccessor.profileName = 'c1s';
                   await this._userProfileAccessor.set(stepContext.context, "c1s");
                   //this._userSearchAccessor.searchType = 'advanced';
                   await this._userSearchAccessor.set(stepContext.context, "advanced");
                   console.log ("168 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                   }

                   else if ((profileName != '' && str == 'p1s') || (profileName != '' && str == 'p1 s')) 

                   //INDEX c1 i button or c1i typed in
                   {
                   console.log ("\n175 button p1 s or typed p1s str = " + str + '\n');
                   stepContext.context.activity.text = 'p1s:0/0/0/0';
                   ////this._userProfileAccessor.profileName = 'p1s';
                   await this._userProfileAccessor.set(stepContext.context, "p1s");
                   this._userSearchAccessor.searchType = 'advanced';
                   await this._userSearchAccessor.set(stepContext.context, "advanced");
                   }


                   //change contract if stored c1/p1
                   else if (profileName == 'c1' && str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1)
                   {
                   //console.log ("\n185 got c1 str = " + str + '\n');
                   stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';
                   ////this._userProfileAccessor.profileName = 'p1'; //change contract after restart
                   await this._userProfileAccessor.set(stepContext.context, "p1");
                   }

                   else if (profileName == 'p1' && str.indexOf('Construction Contract 1st Ed 1999',0) != -1)
                   {
                   //console.log ("\n192 got p1 str = " + str + '\n');
                   stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';
                   ////this._userProfileAccessor.profileName = 'c1'; //change contract after restart
                   await this._userProfileAccessor.set(stepContext.context, "c1");
                   } 
 
                    
                   else

                   {              
                   
                   //console.log ("\n204 IN str = " + str);  

                   //keyword1
                   if (isNaN(str)) 
                         {
                         var profileName = await this._userProfileAccessor.get(stepContext.context,false)
                         //var searchType = this._userSearchAccessor.searchType;
                         var searchType = await this._userSearchAccessor.get(stepContext.context);
                         if (searchType == 'advanced2') ///delete this?????
                               {
                               if (profileName != undefined){profileName = profileName.replace('s','')} //to enable normal clause display
                               }
                         //console.log("\n227 keyword1 str = " + str + '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);
 
                         if (str == 'start' || str == 'help') ///reset
                               {
                               //this._userSearchAccessor.searchType = '';
                               await this._userSearchAccessor.set(stepContext.context, "");
                               }

                         var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
                         if (str.indexOf('Construction Contract',0) != -1)
                               {
                               //console.log ("\n226 ...");
                               stepContext.context.activity.text = 'cons1'; //cons1 into userProfile.name
                               ////this._userProfileAccessor.profileName = 'c1'
                               await this._userProfileAccessor.set(stepContext.context, "c1");
                               console.log ("240 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                               }
                               else if (str.indexOf('Plant &',0) != -1 )
                               {
                               //console.log ("\n2244 ...");
                               stepContext.context.activity.text = 'plant1'; //cons1 into userProfile.name
                               ////this._userProfileAccessor.profileName = 'p1'
                               await this._userProfileAccessor.set(stepContext.context, "p1");
                               //console.log ("235 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                               }

                               else if (str == 'c1s' || str == 'p1s') //SEARCH
                               {
                               console.log ("\n252 ...");
                               var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)
                               ////if (str != this._userProfileAccessor.profileName) //changing index for c1s to p1s
                               if (str != profileNameTemp) //changing index for c1s to p1s
                                     {
                                     ////this._userProfileAccessor.profileName = str + ':0/0/0/0';
                                     await this._userProfileAccessor.set(stepContext.context, str + ':0/0/0/0');
                                     //this._userSearchAccessor.searchType = 'advanced';
                                     await this._userSearchAccessor.set(stepContext.context, 'advanced');
                                     stepContext.context.activity.text = str;
                                     //console.log ("258 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                      }

                                } 
          

                               //else if (this._userSearchAccessor.searchType == 'advanced' && profileName != undefined && profileName.indexOf('1s',0) != -1)
                               else if (searchTypeTemp == 'advanced' && profileName != undefined && profileName.indexOf('1s',0) != -1)
                               {
                               console.log ("\n355 str = " + str); //str = [agreement]
                               var strTemp = str.replace(/\[/,'');
                               strTemp = strTemp.replace(/\]/,'');
                               strTemp = strTemp.trim();
                               console.log ("359 strTemp = " + strTemp)


                               if (categoriesAry.includes(strTemp) && str.indexOf('\[',0) != -1) // categories [ agreement ] in

                                    {
                                    qnaMakerOptions.strictFilters = [{name:'category',value:strTemp}]

                                    //str = this._userStringAccessor.stringValue;  // pass 1 stored str agreement
                                    str = await this._userStringAccessor.get(stepContext.context);
                                    //str = stepContext.context.activity.text;
                                    //str = 'agreement'

                                    //console.log ("370 this._userStringAccessor.stringValue = " + this._userStringAccessor.stringValue)
                                    //console.log ("370 stepContext.context.activity.text = " + stepContext.context.activity.text)
                                    console.log ("370 str = " + str) //str = xx

                                    stepContext.context.activity.text = str;

                                    //this._userSearchAccessor.searchType = 'advanced1';  //go to collapsed clauses
                                     await this._userSearchAccessor.set(stepContext.context, 'advanced1');

                                    //console.log ("346 SENT COLLAPSED stepContext.context.activity.text = " + stepContext.context.activity.text + " with qnaMakerOptions.strictFilters = " + JSON.stringify(qnaMakerOptions.strictFilters) + "to do advanced1 search\n");


                                    }
                                    else
                                    //for stop search

                                    {
                                    //console.log ("273........");
                                    //this._userStringAccessor.stringValue = str;  //store str for advanced search
                                    var tempText = stepContext.context.activity.text;
                                    //console.log ("276 STOP SEARCH stepContext.context.activity.text = " + tempText);
                                    //reset on "Stop advanced search"

                                    if (tempText.indexOf('Stop search',0) != -1)
                                         {
                                         //this._userSearchAccessor.searchType = '';
                                         await this._userSearchAccessor.set(stepContext.context, '');
                                         await this._userProfileAccessor.set(stepContext.context,'c1');
                                         if (tempText.indexOf('[c1]',0) != -1){profileName = 'c1'}
                                         qnaMakerOptions.scoreThreshold = 0.5;  
                                         qnaMakerOptions.top = 3; 
                                         qnaMakerOptions.strictFilters = null;
                                         //qnaMakerOptions.strictFilters = [{name:'category',value:'prompt'}]
                                         //console.log ("287 RESET AFTER ADVANCED SEARCH - profileName = " + profileName); 
                                         }
                                    }                              
                                }
                          }
                    }


                   //keyword2 -show clause

                   if (isNaN(str))
                         {
                         var strCon, strNo, strConNoFull;
                         profileName = await this._userProfileAccessor.get(stepContext.context,undefined)
                         console.log("\n314 KEYWORD STANDARD STRING str = " + str + '; profileName = ' + profileName);

                         var posnSpace = str.indexOf(' ',0);
                         console.log ("\n317 posnSpace = " + posnSpace);

                         if (posnSpace != -1)  //have space
                                      {
                                      strCon = str.substring(0,posnSpace); //for "c1 agree"
                                      strNo = str.substring(posnSpace+1,str.length);
                                      }
                                      else  //no space
                                      {
                                      strCon = '';
                                      strNo = str;
                                      }

                         if (posnSpace != -1)  //have space "c1 agreement" "c1i agreement" "c1 2.3" "c1i 2.3
                                      {
                                      if (str == 'c1 s' || str== 'p1 s' || str == 'Construction Contract 1st Ed 1999' || str == 'Plant & Design-Build Contract 1st Ed 1999' || str.indexOf('Stop search',0) != -1)  //prompts
                                           //standard conversions
                                           {
                                           if (str == 'c1 s'){str = 'c1s:0.0.0.0';}
                                           var strConNoFull = str;
                                           }
                                           else
                                           {
                                           if (profileName != undefined) {
                                                if (profileName == 'c1s' && strCon == 'c1') 
                                                    {} //strCon takes precedence if show clause during search
                                                    else
                                                    {strCon = profileName;}
                                                }  
                                                else
                                                {if (str == 'Construction Contract 1st Ed 1999'){
                                                    strCon = 'c1';}
                                                    else 
                                                    {if (str == 'Plant & Design-Build Contract 1st Ed 1999'){
                                                        strCon = 'p1';}
                                                    }
                                                 }
                                           console.log ("\n457 ....");
                                           if (isNaN(strNo) && strCon.indexOf('i',0) == -1){strCon = strCon + 'i';} //"c1i agreement"
                                           var strConNoFull = strCon + ' ' + strNo; 
                                           } 
                                       }

                                       else //no space

                                       {
                                       if (str == 'c1s' || str == 'p1s' ||str == 'c1' || str == 'c2' || str == 'help' || str == 'start')  //prompts
                                           //standard conversions
                                           {
                                           if (str == 'c1'){str = 'cons1';}
                                           if (str == 'p1'){str = 'plant1';}
                                           var strConNoFull = str;
                                           }
                                           else // "agreement" "2.1"
                                           {
                                           if (profileName != undefined) {
                                                strCon = profileName;}
                                                else
                                                {if (str == 'Construction Contract 1st Ed 1999'){
                                                      strCon = 'c1';}
                                                      else 
                                                      {if (str == 'Plant & Design-Build Contract 1st Ed 1999'){
                                                         strCon = 'p1';}
                                                      }
                                                 }
                                           console.log ("\n485 strCon =  " + strCon);
                                           if (isNaN(strNo) && strCon.indexOf('i',0) == -1){strCon = strCon + 'i';} //"c1i agreement" and not c1s
                                           console.log ("\n487 strCon =  " + strCon);
                                           var strConNoFull = strCon + ' ' + strNo;
                                           }
                                       }

                                  if (!isNaN(strNo))
                                       {
                                       if (strNo.length == 1){strConNoFull = strConNoFull + '.0.0.0';}
                                       if (strNo.length == 3){strConNoFull = strConNoFull + '.0.0';}
                                       if (strNo.length == 5){strConNoFull = strConNoFull + '.0';}
                                       }
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('c1 ','c1:');
                                  strConNoFull = strConNoFull.replace('p1 ','p1:');
                                  //strConNoFull = strConNoFull.replace('c1s ','c1:');
                                  //strConNoFull = strConNoFull.replace('p1s ','p1:');
                                  strConNoFull = strConNoFull.replace('c1i ','c1i:');
                                  strConNoFull = strConNoFull.replace('p1i ','p1i:');

                                  //console.log("\n404 strConNoFull = " + strConNoFull);

                                  if (strConNoFull != 'c1s:0/0/0/0'){

                                       stepContext.context.activity.text = strConNoFull;

                                       //console.log ("\n412 SENT STANDARD STRING stepContext.context.activity.text = " + stepContext.context.activity.text);
                                       }
                                  }

                         else
                         {

                         console.log("\n422 NUMBER STANDARD STRING  str = " + str);              

                         var strCon = '';
                         var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)
                         //if (this._userProfileAccessor.profileName == "c1" || this._userProfileAccessor.profileName == "p1" )
                         if (profileNameTemp == "c1" || profileNameTemp== "p1" )
                               {
                               //console.log("\n429 profileName = " + this._userProfileAccessor.profileName)
                               //// strCon = this._userProfileAccessor.profileName + ":";
                               strCon = profileNameTemp + ":";
                               //strCon = profileNameTemp  + ":";
                               //console.log ("\n430 strCon =" + strCon);
                               }

                         var strNo = str.toString();
                         //console.log ("435 strNo =" + strNo);

                         var strNoFull = strNo;
                         if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                         if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                         if (strNo.length == 5){strNoFull = strNoFull+'.0';}
                         //console.log ("\n440 strNoFull =" + strNoFull);

                         var strConNoFull = strCon + strNoFull;

                         //console.log("\n444 strConNoFull = " + strConNoFull);

                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('c1 ','c1:');
                         strConNoFull = strConNoFull.replace('p1 ','p1:');

                         console.log("\n453 A keyword strConNoFull = " + strConNoFull);

                         var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

                         //if (this._userSearchAccessor.searchType == "advanced"){strConNoFull = 'Search active\n\n' + strConNoFull;}
                         if (searchTypeTemp == "advanced"){strConNoFull = 'Search active\n\n' + strConNoFull;}
                         stepContext.context.activity.text = strConNoFull;

                         console.log ("\n458 SENT STANDARD STRING stepContext.context.activity.text = " + stepContext.context.activity.text);

                         }

 
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


//First pass - set metadata


        //console.log("\n481 activity.text = " + stepContext.context.activity.text + '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);

        //console.log("\n483 qnaMakerOptions START = " + JSON.stringify(qnaMakerOptions));
        profileName = await this._userProfileAccessor.get(stepContext.context,false)
        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
        if (searchTypeTemp == "advanced" || searchTypeTemp == "advanced1") //first pass
             {
             //if (profileName != undefined)
                  //{
                  if (profileName.indexOf('1s',0) != -1 && stepContext.context.activity.text.indexOf('1:',0) == -1)  
                       {
                       qnaMakerOptions.scoreThreshold = 0.05; 
                       qnaMakerOptions.top = 50;
                       }
                       else
                       {
                       qnaMakerOptions.scoreThreshold = 0.5; 
                       qnaMakerOptions.top = 3;
                        }
                   //}
            }
            else
            {
            //if (qnaMakerOptions.strictFilters == null) //WORKS, start with nothing defined
                 //{
                 //qnaMakerOptions.strictFilters = [{name:'category',value:'contents'}];
                 // }
                 //else //not null so can change name and value
                 {
                      qnaMakerOptions.scoreThreshold = 0.5; 
                      qnaMakerOptions.top = 3;
                 }
             }

        console.log("\n509 qnaMakerOptions END = " + JSON.stringify(qnaMakerOptions));

        //remove c1si for search
        var textTemp = stepContext.context.activity.text;
        var textOrig = stepContext.context.activity.text;

        textTemp = textTemp.replace('c1si ','')
        textTemp = textTemp.replace('p1si ','')
        stepContext.context.activity.text = textTemp;

        //kill search for index search (i.e., c1i:agreement")
        if (textOrig == 'c1i:'){await this._userSearchAccessor.set(stepContext.context, '');}
        if (textOrig == 'p1i:'){await this._userSearchAccessor.set(stepContext.context, '');}



//////////////////////////////////////////

        var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);

//////////////////////////////////////////
        
        //console.log("\n610 response = " + JSON.stringify(response))
        
        //console.log("\n612 this._userProfileAccessor.profileName = " + this._userProfileAccessor.profileName)
        
    
/*//deactivate my side
     if (this._welcomedUserProperty != undefined){ 
            const didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
            console.log("618 didBotWelcomedUser = " + didBotWelcomedUser) 
            
            if (didBotWelcomedUser == undefined){
                console.log("621 didBotWelcomedUser = undefined")    
                
                if (response.answers[0] == undefined){  
                     console.log("624 response.answers[0] = " + response.answers[0]) 
                    
                     if (this._userProfileAccessor.profileName == undefined){  //send dummy
                         console.log("627 profileName = " + this._userProfileAccessor.profileName) 
                         
                         console.log("629 reponse = default welcome") 
                         response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Welcome to FIDICchatbot","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]} 
                         
                         } else { 
                         console.log("633 profileName = " + this._userProfileAccessor.profileName) 
                         
                         }
                                                   
                     } else { 
                         
                     console.log("639 response.answers[0] = " + response.answers[0]) 
                     console.log("640 reponse = let pass") 
                     //response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                     
                     } 
                
                 } else {    
                     
                 console.log("646 didBotWelcomedUser = " + didBotWelcomedUser) 
                     
                 if (didBotWelcomedUser == 1){
                      console.log("649 response.answers[0] = " + response.answers[0]) 
                      if (response.answers[0] == undefined){
                                                 
                          console.log("652 response.answers[0] = " + response.answers[0]) 
                          //response = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                         
                          } else { 

                          console.log("657 response.answers[0] = " + response.answers[0])  
                          //response = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                          } 
                     
                      } else if (didBotWelcomedUser == 2){
                          
                          console.log("663 didBotWelcomedUser = " + didBotWelcomedUser) 
                      
                          if (response.answers[0] == undefined){  
                               console.log("666 response.answers[0] = " + response.answers[0]) 
                    
                               if (this._userProfileAccessor.profileName == undefined){  
                                   console.log("669 profileName = " + this._userProfileAccessor.profileName) 
                         
                                   console.log("671 reponse = default welcome") 
                                   response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Welcome to FIDICchatbot","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]} 
                         
                                   } else { 
                                   console.log("675 profileName = " + this._userProfileAccessor.profileName)
                                       
                                   console.log("677 reponse = let pass")
                         
                                   }
                                                   
                                } else { 
                                console.log("683 response.answers[0] = " + response.answers[0])
                                
                                console.log("629 reponse = let pass")     
                                //response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                     
                                }
        
                      }         
                          
                  }
              }

  
*/
       
        //console.log("\n678 ANSWER BEFORE PROCESSING response = " + JSON.stringify(response));
                 

/*//not yet Heroku side
////////////////////////////// created truncated reply

        //console.log("\n702 response.answers[0].context.prompts[0] = " + JSON.stringify(response.answers[0].context.prompts[0]))
        console.log("\n703 response.answers[0].questions[0] = " + JSON.stringify(response.answers[0].questions[0]))

        str = response.answers[0].questions[0];

        str = str.replace('\/','.');
        str = str.replace('\/','.');
        str = str.replace('\/','.');
        str = str.replace('\/','.');
        str = str.replace('.0','');
        str = str.replace('.0','');
        str = str.replace('.0','');
        str = str.replace('c1:','c1 ');
        str = str.replace('p1:','p1 ');

        var promptAry = []; 

        for (var i = 0; i < 50; i++)
            {
            if (response.answers[0].context.prompts[i] != undefined)
                 {
                 console.log("\n710 i response.answers[0].context.prompts[i] = " + i + "; " + JSON.stringify(response.answers[0].context.prompts[i]))
                 promptAry[i] =  response.answers[0].context.prompts[i];
                 iTotal = i;
                 } 
                 else {break}
            } 

        response.answers[0].context.prompts[0] = {"displayOrder":0,"qnaId":13499,"qna":null,"displayText":"c1 s"}
        response.answers[0].context.prompts[0].displayText = str

        console.log("\n702 iTotal = " + iTotal)

            for (var i = 1; i < iTotal + 2; i++)
              {
              console.log("\n7173 i promptAry[i-1] = " + i + "; " + JSON.stringify(promptAry[i-1]))
              response.answers[0].context.prompts[i] =  promptAry[i-1];
              }

/////////////////////////////
*/





      


        //console.log("\n610 textOrig = " + textOrig + "; textTemp = " + textTemp + "; activity.text = " + stepContext.context.activity.text+ '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);

        //console.log("\n612 ANSWER BEFORE PROCESSING response.answers[0].answer = " + JSON.stringify(response.answers[0].answer));
        //console.log("\n617 response = HERE");

        //console.log("\n620 PROMPT BEFORE PROCESSING response.answers[0].context = \n" + JSON.stringify(response.answers[0].context))



        if (stepContext.context.activity.text == textTemp && textOrig.indexOf('c1si ',0) != -1)
             {

             //console.log("\n552 ..for activity.text == " + textTemp + " and textOrig includes c1s1: " + textOrig );
          
             //store pass 1 str
             //this._userStringAccessor.stringValue = textTemp;
             await this._userStringAccessor.set(stepContext.context, textTemp);

//FIRST PASS search (get categories for xxxxxx into metatDataAry)

        //console.log("\n553 activity.text = " + stepContext.context.activity.text + '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);

        console.log("\n553 START META response = " + response)


        var metadataAry = new Array(50).fill(null).map(()=>new Array(5).fill(null));

        var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)

        ////if (this._userProfileAccessor.profileName != undefined &&  this._userSearchAccessor.searchType == "advanced") 
        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
        //if (profileNameTemp != undefined &&  this._userSearchAccessor.searchType == "advanced") 
        if (profileNameTemp != undefined && searchTypeTemp == "advanced") 
           {
           console.log("\n573 .....");
           if (profileNameTemp.indexOf('1s',0) != -1)  
               {

               console.log("\n574 .....");



              //clear answers and prompts          

               console.log("\n693 START META ADD START PROMPT response.answers[0].answer = " + response.answers[0].answer)

               for (var i = 0; i < 50; i++) 
                  {if (response.answers[i] != undefined){delete(response.answers[i].answer);}}

               for (var i = 0; i < 50; i++) 
                  {for (var j = 0; j < 50; j++)        
                    {if (response.answers[j] != undefined)
                       {delete(response.answers[j].context.prompts[j]);}}}


            
               //get metadata
               for (var i = 0; i < 50; i++) 
                  {
                  if (response.answers[i] != undefined)
                      {
                      for (var j = 0; j < 10; j++) 
                          {
                          var qCon = response.answers[i].questions[0];
                          qCon = qCon.substring(0, qCon.indexOf(':',0));
                          var profileNameTemp = profileName.replace('s','')

                          if (response.answers[i].metadata[j] != undefined && profileNameTemp == qCon)
                              {
                              metadataAry[i][j] = response.answers[i].metadata[j];
                              }
                              else
                              {
                              break
                              }
                          }
                      }
                      else
                      {
                      break
                      }
                   } 


//Pass 1 - get categories into an array

               console.log("\n593 .....");

               var categoryAry = []; 

               for (var i = 0; i < 50; i++)
                    {
                    for (var j = 0; j < 10; j++)
                        {

                        if (metadataAry[i][j] != null)
                            {
                            var valueTemp = metadataAry[i][j].value;

                            var inAry = false;
                            for (var k = 0; k < 50; k++)
                                {
                                if (categoryAry[k] == valueTemp)
                                     {
                                     inAry = true;
                                     }
                                     else if (inAry != true)
                                     {inAry = false;}
                                 }

                            if (inAry == false)
                                 {
                                 //console.log("619 i j metadataAry[i][j]= " + i + "; " + j + "; " + JSON.stringify(metadataAry[i][j]));

                                 if (metadataAry[i][j].name == 'category'){
                                      categoryAry.push(metadataAry[i][j].value);
                                      //console.log("623 value ........ = " + metadataAry[i][j].value)
                                      }
                                 } //if
                            } //if
                         } //for
                    }//for


               if (response.answers[0].answer != undefined) {response.answers[0].answer = "Search - select a category";}  //first pass


//Stage 1 create prompts


               console.log("\n650 pass1 metadataAry = " + JSON.stringify(metadataAry));
               console.log("\n650 pass1 categoryAry = " + JSON.stringify(categoryAry));
               //console.log("\n650 END META response = " + JSON.stringify(response))               
               //console.log("\n650 END META response")



               if (categoryAry.length == 0)
                    {
                    console.log("\n645 In categoryAry.length = " + categoryAry.length);
                    for (var i = 0; i < 20; i++) 
                        {
                        delete response.answers[0].context.prompts[i];
                        }
                    response.answers[0].answer = 'No search categories for keyword = \"' + stepContext.context.activity.text + '\". Try again?';

                    response.answers[0].context.prompts[0] = {displayOrder:0,qna:null,displayText:'c1 s'};
                    }
                    else
                    {
                    for (var i = 0; i < categoryAry.length; i++) 
                         {
                         //shows all clauses, not collapsed clauses
                         var displayTextTemp = '[ ' + categoryAry[i] + ' ]'; //str in memoryfor advanced search pass 2
                         var qnaIdTemp = 2000 + i

                         //var answerPrompt = {displayOrder:0,qnaId:qnaIdTemp,qna:null,displayText:displayTextTemp}; //// 22222 is any id
                         var answerPrompt = {displayOrder:0,qna:null,displayText:displayTextTemp};

                         response.answers[0].context.prompts[i] = answerPrompt;

                         //console.log("\n667 answerPrompt(categoryAry.length>0) = " + JSON.stringify(answerPrompt));

                         } //end for

                    } //end if

               } //if

         console.log("\n675 META + PROMPTS response.answers[0].context = " + JSON.stringify(response.answers[0].context));
         console.log("\n702 META + PROMPTS response = " + JSON.stringify(response));

         console.log("\n678 END PASS 1");



         } //if

//End pass 1


//Pass 2 - expands clauses

          console.log("\n971 START PASS 2");
          console.log("\n971 Sresponse.answers[0] = \n" + JSON.stringify(response.answers[0]))

           var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
           //if (this._userSearchAccessor.searchType == "advanced1") 
           if (searchTypeTemp == "advanced1")   
               {
               console.log("\n694 ....") 
               //console.log("\n692 PASS 2 advanced1 this._userSearchAccessor.searchType = " + this._userSearchAccessor.searchType)

               //console.log("\n694 START EXPANSION response.answers[0].context = \n" + JSON.stringify(response.answers[0].context))

               for (var iTotal = 0; iTotal < 50; iTotal++) {  //find number of answers to run in reverse
                  if (response.answers[iTotal] == undefined)
                      {
                      break
                      }}

               console.log("\n702 iTotal = " + iTotal)


               var answerTitle, posnTitle, combinedAnswers = ''; 
               var answerPrompt = '';
               for (var i = 0; i < iTotal; i++) 
                  {
                  if (response.answers[i] != undefined){

                     answerTitle = response.answers[i].answer;

                     posnTitle = answerTitle.indexOf(': ',0);
                     answerTitle = answerTitle.substring(0,posnTitle);
                     if (i > 0){combinedAnswers = '\n\n' + combinedAnswers;}

                     console.log("\n  ")

                     combinedAnswers = answerTitle + combinedAnswers;
                     
                     console.log("721 i, combinedAnswers = " + i + " ; "  + JSON.stringify(combinedAnswers))

                     var answerId = response.answers[i].id;

                     var questionStr = response.answers[i].questions;

                     questionStr = questionStr.toString();

                     questionStr = questionStr.replace(/\/0/g,'');
                     questionStr = questionStr.replace(/\//g,'.');
                     questionStr = questionStr.replace(':',' ');

                     var metadataStr = response.answers[i].metadata;

                     metadataStr = metadataStr.toString();

                     answerPrompt = {displayOrder:0, qna:null,displayText:questionStr};

                     var iCount = iTotal-1-i;

                     console.log("\n741 iCount, answerPrompt = " + iCount + " ; "  + JSON.stringify(answerPrompt))

                     response.answers[0].context.prompts[iCount] = answerPrompt;

                     }
                     else {break}

                  } 

             //this._userSearchAccessor.searchType = 'advanced';  //reset to advanced for normal clause display
             await this._userSearchAccessor.set(stepContext.context, 'advanced')

             qnaMakerOptions.strictFilters = null; //reset

             response.answers[0].answer = combinedAnswers;


             var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

             //if (this._userSearchAccessor.searchType == 'advanced')
             if (searchTypeTemp == 'advanced')
                   {
                   ////var conTemp = this._userProfileAccessor.profileName
                   var conTemp = await this._userProfileAccessor.get(stepContext.context,false)

                   conTemp = conTemp.replace('s','')
                   console.log ("\n870 iTotal = " + iTotal)
                   response.answers[0].context.prompts[iTotal + 1] = {displayOrder:1,qna:null,displayText:'Stop search [' + conTemp +']'};
                   }

             //console.log("\n766 END EXPANSION response.answers[0].answer = \n" + JSON.stringify(response.answers[0].answer))

             //console.log("\n768 END EXPANSION response.answers[0].context = \n" + JSON.stringify(response.answers[0].context))

             }


} //End error handling - word not in doc

//End combine clauses for advanced search



        console.log("\n777 After processing ..");

        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;

        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

        if (searchTypeTemp == 'advanced')
             {
             response.answers[0].answer = 'Search active\n\n' + response.answers[0].answer;
             }

        console.log("\n787 dialogOptions = " + JSON.stringify(dialogOptions));

        stepContext.values[QnAData] = response.answers;

        var result = [];
        if (response.answers.length > 0) {
            result.push(response.answers[0]);
        }

        stepContext.values[QnAData] = result;

        //console.log("\n919 After processing .. result = " + JSON.stringify(result));

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


                console.log("\n945 After processing .. answer.context.prompts = " + JSON.stringify(answer.context.prompts));


                //for search - prompt stop. answer is original unprocessed answer

                 var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)
                 //if (this._userProfileAccessor.profileName != undefined && this._userSearchAccessor.searchType != undefined){
                 if (profileNameTemp != undefined && this._userSearchAccessor.searchType != undefined){

                    var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
                    if (searchTypeTemp == 'advanced')
                        {
                        var conTemp = profileNameTemp;
                        conTemp = conTemp.replace('s','')
                        var lenPrompts = Object.keys(answer.context.prompts).length;
                        answer.context.prompts[lenPrompts] = {displayOrder:1,qna:null,displayText:'Stop search [' + conTemp +']'};
                       }
                 }



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

        //console.log("\n945 qnaDialogResponseOptions = " + JSON.stringify(qnaDialogResponseOptions));

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
                    
                //console.log("\n978 response no answer?");
                    
                //if (this._welcomedUserProperty != undefined && stepContext != undefined) ///xxxx first input
                     //{
                      
                     //responses[0].answer = 'No answer on start. Please submit start.';
                         
                     //await stepContext.context.sendActivity(responses[0].answer);
                         
                     //}
                    //else
                    //{                    
                    await stepContext.context.sendActivity(qnaDialogResponseOptions.noAnswer);
                    //}
                }
            
            return await stepContext.next();
            }
}

async changeContract(stepContext, userState) { 

       console.log("\n\n973 ..........SAVE..............");

       var currentQuery = stepContext._info.values.currentQuery;
       var currentPosn = currentQuery.indexOf(':',0);    
       var currentContract = currentQuery.substring(0, currentPosn); 

       //console.log("\n920 currentQuery  = " + currentQuery);
       //console.log("\n921 currentContract  = " + currentContract + "\n");
       //console.log("\n922 ProfileAccessor.profileName = " + this._userProfileAccessor.profileName);
       //console.log("\n923 userSearchAccessor.searchType = " + this._userSearchAccessor.searchType);
       //console.log("\n924 userWelcomAccessor.welcomedStatus = " + this._userWelcomeAccessor.welcomedStatus);

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


