// Copyright (c) Bricad Associates 2020

// ver 5 April 2020

//alterations use: qnamaker replace alterations --in wordAlterations.json

var categoriesAry = ["agreement","certificate","clause","condition","contractor","dab","defect","definition","design","document","duty","employer","engineer","equipment","failure","force-majeure","instruction","insurance","measure","obligation","part","particular","payment","personnel","programme","security","site","subcontract","suspension","taking-over","termination","test","time","value","variation"];

const { ComponentDialog, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');

const { InputHnts } = require('botbuilder');

const { QnACardBuilder } = require('../utils/qnaCardBuilder');

const { QnAMaker } = require('botbuilder-ai'); 

const DefaultThreshold = 0.5;
const DefaultTopN = 3;
const DefaultRankerType = '';

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
const USER_STRING_PROPERTY = 'userStringAccessor';
const USER_QNAIDC1_PROPERTY = 'userQnaidC1Accessor';
const USER_QNAIDP1_PROPERTY = 'userQnaidP1Accessor';
const USER_PREVQNAIDC1_PROPERTY = 'userPrevQnaidC1Accessor';
const USER_PREVQNAIDP1_PROPERTY = 'userPrevQnaidP1Accessor';
const WELCOMED_USER = 'welcomedUserProperty';



class QnAMakerMultiturnDialog extends ComponentDialog {
   
    constructor(userState,conversationState) { 
 

        super(QNAMAKER_MULTITURN_DIALOG);





const qnaService = new QnAMaker({
    knowledgeBaseId: process.env.QnAKnowledgebaseId,
    endpointKey: process.env.QnAEndpointKey,
    host: process.env.QnAEndpointHostName
    });

const qnaServicePlant1 = new QnAMaker({
    knowledgeBaseId: process.env.QnAKnowledgebaseIdp1,
    endpointKey: process.env.QnAEndpointKey,
    host: process.env.QnAEndpointHostName
    });


   

        this._qnaMakerService = qnaService;
        this._qnaMakerServicePlant1 = qnaServicePlant1;
        this._userState = userState; 
        this._conversationState = conversationState;
        this._userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY); 
        this._userSearchAccessor = userState.createProperty(USER_SEARCH_PROPERTY); 
        this._userStringAccessor = userState.createProperty(USER_STRING_PROPERTY);
        this._userQnaidC1Accessor = userState.createProperty(USER_QNAIDC1_PROPERTY);
        this._userQnaidP1Accessor = userState.createProperty(USER_QNAIDP1_PROPERTY);
        this._userPrevQnaidC1Accessor = userState.createProperty(USER_PREVQNAIDC1_PROPERTY);
        this._userPrevQnaidP1Accessor = userState.createProperty(USER_PREVQNAIDP1_PROPERTY);
        this._welcomedUserProperty = userState.createProperty(WELCOMED_USER); 

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
  
        console.log("\n\n117 .......MULTITURN......");


        if (this._welcomedUserProperty != undefined && stepContext != undefined){
            const didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
            }

        var JSONstringifythisuserState = JSON.stringify(this._userState);


        await this._userQnaidC1Accessor.set(stepContext.context, 13205);
        await this._userPrevQnaidC1Accessor.set(stepContext.context, 13445);
        await this._userQnaidP1Accessor.set(stepContext.context, 4145);
        await this._userPrevQnaidP1Accessor.set(stepContext.context, 4143);

        var userProfile = await this._userProfileAccessor.get(stepContext.context,false)

        if (userProfile != false && JSONstringifythisuserState.indexOf('cons1',0) != -1) 
             {

             await this._userProfileAccessor.set(stepContext.context, "c1");

             await this._userSearchAccessor.set(stepContext.context, "index");
             //console.log ("\n139 MULTITURN cons1 from QnAMaker IN c1");

             } 
             else if (JSONstringifythisuserState.indexOf('plant1',0) != -1){ 
  
             await this._userProfileAccessor.set(stepContext.context, "p1");

             await this._userSearchAccessor.set(stepContext.context, "index");
             //console.log ("\n147 MULTITURN plant1 from QnAMake IN p1");
             } 

             //Check str
             function keepCharsAbove(inStr, charCode) {
		 var goodChars = [];
            	 for (var x = 0; x < inStr.length; x++) {if (inStr.charCodeAt(x) > charCode) 
		 {goodChars.push(inStr.charAt(x));}}
                 return goodChars.join("");}

             var str = stepContext.context.activity.text;
             str = str.trim();
             str = str.toLowerCase();
             keepCharsAbove(str,38);
             if (str.charAt(str.length - 1) == '.'){str = str.substr(0,str.length - 1)}

             var profileName = await this._userProfileAccessor.get(stepContext.context,false)
     

             //Search
             if ((profileName != '' && str == 'c1s') || (profileName != '' && str == 'c1 s')) 
 

                   {
                   //console.log ("\n163 button c1 s or typed c1s str = " + str + '\n');

                   stepContext.context.activity.text = 'c1s:0/0/0/0';

                   await this._userProfileAccessor.set(stepContext.context, "c1s");

                   await this._userSearchAccessor.set(stepContext.context, "advanced");

                   }

                   else if ((profileName != '' && str == 'p1s') || (profileName != '' && str == 'p1 s')) 

                   {
                   console.log ("\n177 button p1 s or typed p1s str = " + str + '\n');
                   stepContext.context.activity.text = 'p1s:0/0/0/0';

                   await this._userProfileAccessor.set(stepContext.context, "p1s");
                   this._userSearchAccessor.searchType = 'advanced';
                   await this._userSearchAccessor.set(stepContext.context, "advanced");
                   }

                   //else if ((profileName == 'c1' && str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1) || (profileName == 'c1' && str == 'p1')) 
                   else if ((profileName == 'c1' && str.indexOf('plant & design-build contract 1st ed 1999',0) != -1) || (profileName == 'c1' && str == 'p1')) 
                   {
                   console.log ("\n186 = " + str);
                   //stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';
                   stepContext.context.activity.text = 'plant & design-build bontract 1st ed 1999';

                   await this._userProfileAccessor.set(stepContext.context, "p1");
                   }

                   //else if ((profileName == 'p1' && str.indexOf('Construction Contract 1st Ed 1999',0) != -1) || (profileName == 'p1' && str == 'c1'))
                   else if ((profileName == 'p1' && str.indexOf('construction contract 1st ed 1999',0) != -1) || (profileName == 'p1' && str == 'c1'))
                   {
                   //stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';
                   stepContext.context.activity.text = 'construction contract 1st cd 1999';

                   await this._userProfileAccessor.set(stepContext.context, "c1");
                   } 
 
                    
                   else

                   {              
                   
                   console.log ("\n205 IN str = " + str);  

                   //keyword1
                   if (isNaN(str)) 
                         {
                         var profileName = await this._userProfileAccessor.get(stepContext.context,false)

                         var searchType = await this._userSearchAccessor.get(stepContext.context);
                         if (searchType == 'advanced2') ///delete this?????
                               {
                               if (profileName != undefined){profileName = profileName.replace('s','')} //to enable normal clause display
                               }
 

                         if (str == 'start' || str == 'help') ///reset
                               {
                               await this._userSearchAccessor.set(stepContext.context, "");
                               }

                         var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
                         //if (str.indexOf('Construction Contract',0) != -1)
                         if (str.indexOf('construction contract',0) != -1)
                               {
                               stepContext.context.activity.text = 'cons1'; 

                               await this._userProfileAccessor.set(stepContext.context, "c1");

                               }
                               else if (str.indexOf('Plant &',0) != -1 )
                               {
                               stepContext.context.activity.text = 'plant1'; 
                               //stepContext.context.activity.text = 'p1'; //TRIED CHANGE

                               await this._userProfileAccessor.set(stepContext.context, "p1");

                               }

                               else if (str == 'c1s' || str == 'p1s')
                               {
                               var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)

                               if (str != profileNameTemp) 
                                     {
                                     await this._userProfileAccessor.set(stepContext.context, str + ':0/0/0/0');

                                     await this._userSearchAccessor.set(stepContext.context, 'advanced');
                                     stepContext.context.activity.text = str;
                                     
                                     }

                                } 
          
                               else if (searchTypeTemp == 'advanced' && profileName != undefined && profileName.indexOf('1s',0) != -1)
                               {
                               console.log ("\n262 = " + str);
                               var strTemp = str.replace(/\[/,'');
                               strTemp = strTemp.replace(/\]/,'');
                               strTemp = strTemp.trim();


                               if (categoriesAry.includes(strTemp) && str.indexOf('\[',0) != -1) // categories [ agreement ] in

                                    {
                                    qnaMakerOptions.strictFilters = [{name:'category',value:strTemp}]

                                    str = await this._userStringAccessor.get(stepContext.context);

                                    stepContext.context.activity.text = str;

                                    await this._userSearchAccessor.set(stepContext.context, 'advanced1');


                                    }
                                    else //for stop search

                                    {

                                    var tempText = stepContext.context.activity.text.toLowerCase();


                                    //if (tempText.indexOf('Stop search',0) != -1)
                                    if (tempText.indexOf('stop search [c1]',0) != -1)
                                         {
                                         await this._userSearchAccessor.set(stepContext.context, '');
                                         await this._userProfileAccessor.set(stepContext.context,'c1');
                                         if (tempText.indexOf('[c1]',0) != -1){profileName = 'c1'}
                                         qnaMakerOptions.scoreThreshold = 0.5;  
                                         qnaMakerOptions.top = 3; 
                                         qnaMakerOptions.strictFilters = null;
                                         }
                                         else if (tempText.indexOf('stop search [p1]',0) != -1)
                                         {
                                         await this._userSearchAccessor.set(stepContext.context, '');
                                         await this._userProfileAccessor.set(stepContext.context,'p1');
                                         if (tempText.indexOf('[p1]',0) != -1){profileName = 'p1'}
                                         qnaMakerOptions.scoreThreshold = 0.5;  
                                         qnaMakerOptions.top = 3; 
                                         qnaMakerOptions.strictFilters = null;
                                         }
                                    }                              
                                }
                          }
                    }


                   //keyword2 -show clause

                   if (isNaN(str))
                         {
                         var strCon, strNo, strConNoFull;
                         profileName = await this._userProfileAccessor.get(stepContext.context,false)
                         console.log("\n324 KEYWORD STANDARD STRING str = " + str);

                         var posnSpace = str.indexOf(' ',0);

                         if (posnSpace != -1)
                                      {
                                      strCon = str.substring(0,posnSpace); //for "c1 agree"
                                      strNo = str.substring(posnSpace+1,str.length);
                                      }
                                      else 
                                      {
                                      strCon = '';
                                      strNo = str;
                                      }

                         if (posnSpace != -1) 
                                      {

                                      if (str == 'c1 s' || str== 'p1 s' || str == 'construction contract 1st ed 1999' || str == 'plant & design-build contract 1st ed 1999' || str.indexOf('stop search',0) != -1)  //prompts
                                           //standard conversions
                                           {
                                           if (str == 'c1 s'){str = 'c1s:0.0.0.0';}
                                           if (str == 'p1 s'){str = 'p1s:0.0.0.0';}
                                           var strConNoFull = str;
                                           }
                                           else
                                           {
                                           if (profileName != false) {
                                                if ((profileName == 'c1s' && strCon == 'c1') || (profileName == 'p1s' && strCon == 'p1'))
                                                    {} //strCon takes precedence if show clause during search
                                                    else
                                                    {strCon = profileName;}
                                                }  
                                                else
                                                {if (str == 'construction contract 1st ed 1999'){
                                                   console.log ("\n357 = " + str);
                                                    strCon = 'c1';}
                                                    else 
                                                    {if (str == 'plant & design-build contract 1st ed 1999'){
                                                        console.log ("\n362 = " + str);
                                                        strCon = 'p1';}
                                                    }
                                                 }
                                           console.log("\n367 strCon = " + strCon + "; strNo = " + strNo); //strCon = p1; strNo = daa.6

                                           if (isNaN(strNo) && strCon.indexOf('i',0) == -1 && strNo.indexOf('daa.',0) != -1 && strNo.indexOf('rules.',0) != -1){strCon = strCon + 'i';} // ad ii for index except for daa and rules
                                           var strConNoFull = strCon + ' ' + strNo; 

                                           console.log("\n372 strConNoFull = " + strConNoFull);
                                           } 
                                       }

                                       else //no space

                                       {
                                       if (str == 'c1s' || str == 'p1s' ||str == 'c1' || str == 'p1' || str == 'help' || str == 'start')
                                           {
                                           console.log ("\n366 = " + str);
                                           if (str == 'c1'){str = 'cons1';}
                                           if (str == 'p1'){str = 'plant1';}
                                           var strConNoFull = str;
                                           }
                                           else 
                                           {
                                           if (profileName != false) {
                                                strCon = profileName;}
                                                else
                                                {if (str == 'construction contract 1st ed 1999'){
                                                      strCon = 'c1';}
                                                      else 
                                                      {if (str == 'plant & design-build contract 1st ed 1999'){
                                                         strCon = 'p1';}
                                                      }
                                                 }
 
                                           if (isNaN(strNo) && strCon.indexOf('i',0) == -1){strCon = strCon + 'i';} 
                  
                                           var strConNoFull = strCon + ' ' + strNo;
                                           }
                                       }

                                  if (!isNaN(strNo) || strNo.indexOf('daa.',0) != -1 || strNo.indexOf('rules.',0) != -1)
                                       {
                                       console.log("\n407 strConNoFull = " + strConNoFull);
                                       var iC = (strConNoFull.match(/\./g) || []).length;
                                       if (iC == 0){strConNoFull = strConNoFull + '.0.0.0';}
                                       if (iC == 1){strConNoFull = strConNoFull + '.0.0';}
                                       if (iC == 2 ){strConNoFull = strConNoFull + '.0';}
                                       }
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('.','\/');
                                  strConNoFull = strConNoFull.replace('c1 ','c1:');
                                  strConNoFull = strConNoFull.replace('p1 ','p1:');
                                  strConNoFull = strConNoFull.replace('c1i ','c1i:');
                                  strConNoFull = strConNoFull.replace('p1i ','p1i:');

                                  if ((strConNoFull != 'c1s:0/0/0/0') && (strConNoFull != 'p1s:0/0/0/0')){

                                       stepContext.context.activity.text = strConNoFull;

                                      console.log ("\n423 SENT STANDARD STRING stepContext.context.activity.text = " + stepContext.context.activity.text);
                                       }
                                  }

                         else
                         {

                         console.log("\n430 NUMBER STANDARD STRING  str = " + str);              

                         var strCon = '';
                         var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)

                         if (profileNameTemp == "c1" || profileNameTemp== "p1" )
                               {

                               strCon = profileNameTemp + ":";

                               }

                         var strNo = str.toString();


                         var strNoFull = strNo;

                         var iC = (strNoFull.match(/\./g) || []).length;
                         if (iC == 0){strNoFull = strNoFull+'.0.0.0';}
                         if (iC == 1){strNoFull = strNoFull+'.0.0';}
                         if (iC == 2){strNoFull = strNoFull+'.0';}


                         var strConNoFull = strCon + strNoFull;

                         console.log("\n455 strConNoFull = " + strConNoFull);

                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('c1 ','c1:');
                         strConNoFull = strConNoFull.replace('p1 ','p1:');

                         console.log("\n464 A keyword strConNoFull = " + strConNoFull);

                         var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

                         if (searchTypeTemp == "advanced"){strConNoFull = 'Search active\n\n' + strConNoFull;}
                         stepContext.context.activity.text = strConNoFull;

                         console.log ("\n471 SENT STANDARD STRING stepContext.context.activity.text = " + stepContext.context.activity.text);

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


        profileName = await this._userProfileAccessor.get(stepContext.context,false)
        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
        if (searchTypeTemp == "advanced" || searchTypeTemp == "advanced1") //first pass
             {

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

                 {
                      qnaMakerOptions.scoreThreshold = 0.5; 
                      qnaMakerOptions.top = 3;
                 }
             }

        var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false);
        console.log("\n523 profileNameTemp = " + profileNameTemp);
        console.log("524 qnaMakerOptions = " + JSON.stringify(qnaMakerOptions));
        console.log("525stepContext.context.activity.text = " + stepContext.context.activity.text);
        console.log("526 qnaMakerOptions.qnaId = " + qnaMakerOptions.qnaId);



        if (profileNameTemp  == 'p1' && stepContext.context.activity.text.indexOf('plant & design',0) != -1)
           {
           var userQnaidP1 = await this._userQnaidP1Accessor.get(stepContext.context,false)
           var userPrevQnaidP1 = await this._userPrevQnaidP1Accessor.get(stepContext.context,false)
           qnaMakerOptions.context.previousQnAId = userPrevQnaidP1;
           qnaMakerOptions.qnaId = userQnaidP1;
           }

        if (profileNameTemp  == 'c1' && stepContext.context.activity.text.indexOf('construction contract',0) != -1)
           {
           var userQnaidC1 = await this._userQnaidC1Accessor.get(stepContext.context,false)
           var userPrevQnaidC1 = await this._userPrevQnaidC1Accessor.get(stepContext.context,false)
           qnaMakerOptions.context.previousQnAId = userPrevQnaidC1;
           qnaMakerOptions.qnaId = userQnaidC1;
           }

        var textTemp = stepContext.context.activity.text;
        var textOrig = stepContext.context.activity.text;

        textTemp = textTemp.replace('c1si ','')
        textTemp = textTemp.replace('p1si ','')
        stepContext.context.activity.text = textTemp;


        if (textOrig == 'c1i:'){await this._userSearchAccessor.set(stepContext.context, '');}
        if (textOrig == 'p1i:'){await this._userSearchAccessor.set(stepContext.context, '');}

        var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false);

        if (userProfile != false)
          {
          if (profileNameTemp.indexOf('c1',0) != -1)
             {var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);}
             else if (profileNameTemp.indexOf('p1',0) != -1)
             { 
             var response = await this._qnaMakerServicePlant1.getAnswersRaw(stepContext.context, qnaMakerOptions);}
             else
             {var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);}
          }
          else
          {var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);}


        
        //console.log("\n577 RESPONSE =" + JSON.stringify(response));
        


     profileName = await this._userProfileAccessor.get(stepContext.context,false)
     console.log("582 OPENING profileName = " + profileName) 
     var didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
     console.log("584 OPENING didBotWelcomedUser = " + didBotWelcomedUser) 

     if (this._welcomedUserProperty != undefined){ 
            didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
            console.log("687 didBotWelcomedUser = " + didBotWelcomedUser) 
            
            if (didBotWelcomedUser == undefined){
                console.log("590 didBotWelcomedUser = undefined")    
                
                if (response.answers[0] == undefined){  
                     console.log("593 response.answers[0] = " + response.answers[0]) 
                    
                     if (profileName == false){  
                         console.log("596 profileName = " + profileName) 
                         
                         console.log("598 reponse = default welcome 1st pass Messenger") 
                         response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Welcome to FIDICchatbot","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]} 
                         
                         } else { 
                         console.log("602 profileName = " + profileName) 
                         
                         }
                                                   
                     } else { 
                         
                     console.log("608 response.answers[0] = " + response.answers[0]) 
                     console.log("609 reponse = let pass") 
                     //response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                     
                     } 
                
                 } else {    
                     
                 console.log("616 didBotWelcomedUser = " + didBotWelcomedUser) 
                     
                 if (didBotWelcomedUser == 1){
                      console.log("619 response.answers[0] = " + response.answers[0]) 
                      if (response.answers[0] == undefined){
                                                 
                          console.log("622 response.answers[0] = " + response.answers[0]) 
                          //response = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                         
                          } else { 

                          console.log("627 2nd pass messenger response.answers[0] = " + response.answers[0])  
                          response = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Guide","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  

                          } 
                     
                      } else if (didBotWelcomedUser == 2){
                          
                          console.log("634 didBotWelcomedUser = " + didBotWelcomedUser) 
                      
                          if (response.answers[0] == undefined){  
                               console.log("637 response.answers[0] = " + response.answers[0]) 
                    
                               if (profileName == false){  
                                   console.log("640 profileName = " + profileName) 
                         
                                   console.log("642 reponse = default welcome") 
                                   response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Welcome to FIDICchatbot","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]} 
                         
                                   } else { 
                                   console.log("646 profileName = " + profileName)
                                       
                                   console.log("648 reponse = let pass")
                         
                                   }
                                                   
                                } else { 
                                console.log("7653 response.answers[0] = " + response.answers[0])
                                
                                console.log("655 reponse = let pass")     
                                //response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"  ","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  
                     
                                }
                          }                        
                    }
              }

  
        console.log("\n665 ANSWER BEFORE PROCESSING response");
                 
        if (response.answers[0] != undefined)
             {
             //add clause number to prompts (for Messenger's 2 messages)
             str = response.answers[0].questions[0];
             if (str.indexOf('c1:',0) != -1 || str.indexOf('p1:',0) != -1)
                {
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
                         console.log("\n689 i response.answers[0].context.prompts[i] = " + i + "; " + JSON.stringify(response.answers[0].context.prompts[i]))
                         promptAry[i] =  response.answers[0].context.prompts[i];
                         iTotal = i;
                         } 
                         else {break}
                     } 
                 profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false);
                 if (profileNameTemp.indexOf('c1',0) != -1)
                     {userPrevQnaidC1 = await this._userPrevQnaidC1Accessor.get(stepContext.context,false)
                     response.answers[0].context.prompts[0] = {"displayOrder":0,"qnaId":userPrevQnaidC1,"qna":null,"displayText":"c1 s"}}
                 if (profileNameTemp.indexOf('p1',0) != -1)
                     {userPrevQnaidP1 = await this._userPrevQnaidP1Accessor.get(stepContext.context,false)
                     response.answers[0].context.prompts[0] = {"displayOrder":0,"qnaId":userPrevQnaidP1,"qna":null,"displayText":"p1 s"}}

                 response.answers[0].context.prompts[0].displayText = str

                 console.log("\n699 iTotal = " + iTotal)

                 for (var i = 1; i < iTotal + 2; i++)
                    {
                    console.log("\n703 i promptAry[i-1] = " + i + "; " + JSON.stringify(promptAry[i-1]))
                    response.answers[0].context.prompts[i] =  promptAry[i-1];
                    }
                } //end if str
            } //end if response




     console.log("\n710 BEFORE PROCESSING");
 
     if (response.answers[0] != undefined)
        {

        if ((stepContext.context.activity.text == textTemp && textOrig.indexOf('c1si ',0) != -1) || (stepContext.context.activity.text == textTemp && textOrig.indexOf('p1si ',0) != -1))
             {

             await this._userStringAccessor.set(stepContext.context, textTemp);

             //FIRST PASS search (get categories for xxxxxx into metatDataAry)

        var metadataAry = new Array(50).fill(null).map(()=>new Array(5).fill(null));

        var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)
 
        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

        if (profileNameTemp != undefined && searchTypeTemp == "advanced") 
           {

           if (profileNameTemp.indexOf('1s',0) != -1)  
               {       

               console.log("\n736 START META ADD START PROMPT response.answers[0].answer = " + response.answers[0].answer)

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

               console.log("\n776 .....");

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

               //console.log("\n856 response = " + JSON.stringify(response))

               //if (response.answers[0].answer != undefined) 
                   //{
                   response.answers[0].answer = "Search - select a category";
                   //}  //first pass
 
               //console.log("\n863response = " + JSON.stringify(response))

//Stage 1 create prompts


               //console.log("\n831 pass1 metadataAry = " + JSON.stringify(metadataAry));
               //console.log("\n832 pass1 categoryAry = " + JSON.stringify(categoryAry));
               //console.log("\n833 categoryAry.length" + categoryAry.length) 
               //console.log("\n834 END META response.answers[0] = " + JSON.stringify(response.answers[0])) 
             

               if (categoryAry.length == 0) //check no category situation?? There will always be a category??
                    {
                    for (var i = 0; i < 20; i++) 
                        {
                        delete response.answers[0].context.prompts[i];
                        }
                    response.answers[0].answer = 'No search categories for keyword = \"' + stepContext.context.activity.text + '\". Try again?';

                    response.answers[0].context.prompts[0] = {displayOrder:0,qna:null,displayText:'c1 s'};
                    }
                    else
                    {
                    //clean out questions

                    for (var i = 1; i < 20; i++)
                       {
                       delete response.answers[0].questions[i];
                       }

                    //console.log("\n856 cleaning 1111 questions - response.answers[0] = " + JSON.stringify(response.answers[0])) 

                    //clean out prompts

                     response.answers[0].context.prompts = [];

                    //console.log("\n863 cleaning 2222 prompts - response.answers[0] = " + JSON.stringify(response.answers[0])) 
                    
                    for (var i = 0; i < categoryAry.length; i++) 
                         {
                         console.log("\n868 i, categoryAry[i] = " + categoryAry[i]) 
                         //shows all clauses, not collapsed clauses
                         var displayTextTemp = '[ ' + categoryAry[i] + ' ]'; //str in memoryfor advanced search pass 2
                         var qnaIdTemp = 2000 + i

                         var answerPrompt = {displayOrder:0,qna:null,displayText:displayTextTemp};

                         response.answers[0].context.prompts[i] = answerPrompt;


                         } //end for

                    } //end if

               } //if

         //console.log("\n884 META + PROMPTS response.answers[0].context = " + JSON.stringify(response.answers[0].context));
         //console.log("\n885 META + PROMPTS response = " + JSON.stringify(response));

         console.log("\n887 END PASS 1");

         } //if

    } //end if response

//End pass 1


//Pass 2 - expands clauses

          console.log("\n875 START PASS 2");


           var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

           if (searchTypeTemp == "advanced1")   
               {

               for (var iTotal = 0; iTotal < 50; iTotal++) {  //find number of answers to run in reverse
                  if (response.answers[iTotal] == undefined)
                      {
                      break
                      }}

               //console.log("\n889 iTotal = " + iTotal)


               var answerTitle, posnTitle, combinedAnswers = ''; 
               var answerPrompt = '';
               for (var i = 0; i < iTotal; i++) 
                  {
                  if (response.answers[i] != undefined){

                     answerTitle = response.answers[i].answer;

                     posnTitle = answerTitle.indexOf(': ',0);
                     answerTitle = answerTitle.substring(0,posnTitle);
                     if (i > 0){combinedAnswers = '\n\n' + combinedAnswers;}

                     //console.log("\n  ")

                     combinedAnswers = answerTitle + combinedAnswers;

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

                     response.answers[0].context.prompts[iCount] = answerPrompt;

                     }
                     else {break}

                  } 

             console.log("\n933 AFTER PROMPTS response.answers[0].context = \n" + JSON.stringify( response.answers[0].context))

             await this._userSearchAccessor.set(stepContext.context, 'advanced')

             qnaMakerOptions.strictFilters = null; //reset

             response.answers[0].answer = combinedAnswers;

             console.log("\n941 combinedAnswers response.answers[0].answer = \n" + JSON.stringify(response.answers[0].answer))



             var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
             if (searchTypeTemp == 'advanced')
                   {
                   var conTemp = await this._userProfileAccessor.get(stepContext.context,false)
                   conTemp = conTemp.replace('s','')
                   console.log ("\n953 iTotal = " + iTotal)
                   response.answers[0].context.prompts[iTotal] = {displayOrder:1,qna:null,displayText:'stop search [' + conTemp +']'};
                   }




             }

    } //End error handling - word not in doc

//End combine clauses for advanced search

        //console.log("\n984 After processing response.answers = " + JSON.stringify(response.answers));

        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;

        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

        if (searchTypeTemp == 'advanced' && response.answers[0] != undefined)
             {
             response.answers[0].answer = 'Search active\n\n' + response.answers[0].answer;
             }

        stepContext.values[QnAData] = response.answers;

        var result = [];
        if (response.answers.length > 0) {
            result.push(response.answers[0]);
        }

        stepContext.values[QnAData] = result;

        //console.log("\n1005 OUT1 NOT PROCESSED result = " + JSON.stringify(result))

        return await stepContext.next(result); 

    }



    async checkForMultiTurnPrompt(stepContext, answerNoAnswerDeep) {

       //console.log("\n1029 stepContext.result= " + JSON.stringify(stepContext.result))
       //console.log("\n1030 stepContext.result.length= " + stepContext.result.length)

        if (stepContext.result != null && stepContext.result.length > 0) {

            var answer = stepContext.result[0];

            //console.log("\n1001 answer= " + JSON.stringify(answer))

            //Got prompts. For clauses, change result to answerNoAnswerDeep


            if (answer.questions[0].indexOf('c1:',0) != -1 || answer.questions[0].indexOf('p1:',0) != -1) 
                {
                var answerNoAnswerDeep = JSON.parse(JSON.stringify(answer));
                var answerNoAnswerDeepStore = JSON.parse(JSON.stringify(answer));
                answerNoAnswerDeep.answer = "" //remove answer
                var answer = JSON.parse(JSON.stringify(answerNoAnswerDeep)); //back to answe
                }

            //if ((answer.context != null && answer.context.prompts != null && answer.context.prompts.length > 0) || answer.questions[0].indexOf('c1:',0) != -1 || answer.questions[0].indexOf('p1:',0) != -1)
            if (answer.context != null && answer.context.prompts != null && answer.context.prompts.length > 0)
                {
                //console.log("\n1038 OUT2 PROCESSING PROMPT")

                var dialogOptions = getDialogOptionsValue(stepContext);

                var previousContextData = {};

                if (!!dialogOptions[QnAContextData]) {
                    previousContextData = dialogOptions[QnAContextData];
                }

                if (answer.questions[0].indexOf('c1:',0) == -1 && answer.questions[0].indexOf('p1:',0) == -1) //not for passed prompts
                    {
                     answer.context.prompts.forEach(prompt => {
                       previousContextData[prompt.displayText.toLowerCase()] = prompt.qnaId;
                       });
                    }

                //for search - prompt stop. answer is original unprocessed answer

//maybe only need for consolidated with no prompts
/*
                 var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)
                 if (profileNameTemp != undefined && this._userSearchAccessor.searchType != undefined){

                    var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);
                    if (searchTypeTemp == 'advanced')
                        {
                        var conTemp = profileNameTemp;
                        conTemp = conTemp.replace('s','')
                        var lenPrompts = Object.keys(answer.context.prompts).length;
                        answer.context.prompts[lenPrompts] = {displayOrder:1,qna:null,displayText:'stop search [' + conTemp +']'};
                       }

                 }
*/

                dialogOptions[QnAContextData] = previousContextData;
                dialogOptions[PreviousQnAId] = answer.id;
                stepContext.activeDialog.state.options = dialogOptions;

                if (answer.questions[0].indexOf('c1:',0) != -1 || answer.questions[0].indexOf('p1:',0) != -1) 
                   //await stepContext.context.sendActivity("TESTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                   {
                   await stepContext.context.sendActivity(answerNoAnswerDeepStore.answer);
                   }

                console.log("\n1095 answer = " + JSON.stringify(answer)) //shows with prompt

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

        console.log("\n1125 END END stepContext.result = " + JSON.stringify(stepContext.result));

        var responses = stepContext.result;
        if (responses != null) {
            if (responses.length > 0) {

                console.log("\n1131 END END responses[0].answer = " + JSON.stringify(responses[0].answer));

                await stepContext.context.sendActivity(responses[0].answer);

                } else {
                    
                await stepContext.context.sendActivity(qnaDialogResponseOptions.noAnswer);

                }
            
            return await stepContext.next();
            }
}

async changeContract(stepContext, userState) { 

       console.log("\n\n1147..........SAVE..............");

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


