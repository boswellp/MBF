// Copyright (c) Bricad Associates 2020

// ver 2 April 20

//alterations use: qnamaker replace alterations --in wordAlterations.json

var categoriesAry = ["agreement","certificate","clause","condition","contractor","dab","defect","definition","document","duty","employer","engineer","equipment","failure","force-majeure","instruction","insurance","measure","obligation","part","particular","payment","personnel","programme","security","site","subcontract","suspension","taking-over","termination","test","time","value","variation"];

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
const WELCOMED_USER = 'welcomedUserProperty';

class QnAMakerMultiturnDialog extends ComponentDialog {
   
    constructor(userState,conversationState) { 
 
        super(QNAMAKER_MULTITURN_DIALOG);

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
        this._userStringAccessor = userState.createProperty(USER_STRING_PROPERTY);
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


var userProfile = await this._userProfileAccessor.get(stepContext.context,false)
console.log("\n128 userProfile = " + userProfile);
if (userProfile != false)
    {
    if (userProfile.indexOf('p1',0) != -1){
      
        const qnaService = new QnAMaker({
        knowledgeBaseId: process.env.QnAKnowledgebaseIdp1,
        endpointKey: process.env.QnAEndpointKey,
        host: process.env.QnAEndpointHostName
        });

        } else {

        const qnaService = new QnAMaker({
        knowledgeBaseId: process.env.QnAKnowledgebaseId,
        endpointKey: process.env.QnAEndpointKey,
        host: process.env.QnAEndpointHostName
        });

        }
        
     } else {

     const qnaService = new QnAMaker({
     knowledgeBaseId: process.env.QnAKnowledgebaseId,
     endpointKey: process.env.QnAEndpointKey,
     host: process.env.QnAEndpointHostName
     });
                
}

        console.log("\n126 .......MULTITURN......");

        if (this._welcomedUserProperty != undefined && stepContext != undefined){
            const didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
            }

        var JSONstringifythisuserState = JSON.stringify(this._userState);


        var userProfile = await this._userProfileAccessor.get(stepContext.context,false)

        if (userProfile != false && JSONstringifythisuserState.indexOf('cons1',0) != -1) //cons1 comes from QnAMaker and not got profileName
             {

             await this._userProfileAccessor.set(stepContext.context, "c1");

             await this._userSearchAccessor.set(stepContext.context, "index");

             } 
             else if (JSONstringifythisuserState.indexOf('plant1',0) != -1){ 
  
             await this._userProfileAccessor.set(stepContext.context, "p1");

             await this._userSearchAccessor.set(stepContext.context, "index");
             } 

///need to check str

         var str = stepContext.context.activity.text;

         var profileName = await this._userProfileAccessor.get(stepContext.context,false)
     
         console.log ("\n157 IN str = " + str);

             //Search
             if ((profileName != '' && str == 'c1s') || (profileName != '' && str == 'c1 s')) 
 
                   {

                   stepContext.context.activity.text = 'c1s:0/0/0/0';

                   await this._userProfileAccessor.set(stepContext.context, "c1s");

                   await this._userSearchAccessor.set(stepContext.context, "advanced");
                   }

                   else if ((profileName != '' && str == 'p1s') || (profileName != '' && str == 'p1 s')) 

                   {
                   stepContext.context.activity.text = 'p1s:0/0/0/0';

                   await this._userProfileAccessor.set(stepContext.context, "p1s");
                   this._userSearchAccessor.searchType = 'advanced';
                   await this._userSearchAccessor.set(stepContext.context, "advanced");
                   }

                   else if ((profileName == 'c1' && str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1) || (profileName == 'c1' && str == 'p1')) 
                   {

                   stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';

                   await this._userProfileAccessor.set(stepContext.context, "p1");
                   }

                   else if ((profileName == 'p1' && str.indexOf('Construction Contract 1st Ed 1999',0) != -1) || (profileName == 'p1' && str == 'c1'))
                   {

                   stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';

                   await this._userProfileAccessor.set(stepContext.context, "c1");
                   } 
 
                    
                   else

                   {              
                   
                   console.log ("\n204 IN str = " + str);  

                   //Keyword1
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
                         if (str.indexOf('Construction Contract',0) != -1)
                               {

                               stepContext.context.activity.text = 'cons1'; //cons1 into userProfile.name

                               await this._userProfileAccessor.set(stepContext.context, "c1");

                               }
                               else if (str.indexOf('Plant &',0) != -1 )
                               {

                               stepContext.context.activity.text = 'plant1'; //cons1 into userProfile.name

                               await this._userProfileAccessor.set(stepContext.context, "p1");

                               }

                               else if (str == 'c1s' || str == 'p1s') //SEARCH
                               {

                               var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)

                               if (str != profileNameTemp) //changing index for c1s to p1s
                                     {

                                     await this._userProfileAccessor.set(stepContext.context, str + ':0/0/0/0');

                                     await this._userSearchAccessor.set(stepContext.context, 'advanced');
                                     stepContext.context.activity.text = str;
                                     
                                     }

                                } 
          
                               else if (searchTypeTemp == 'advanced' && profileName != undefined && profileName.indexOf('1s',0) != -1)
                               {

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

                                    var tempText = stepContext.context.activity.text;


                                    if (tempText.indexOf('Stop search',0) != -1)
                                         {

                                         await this._userSearchAccessor.set(stepContext.context, '');
                                         await this._userProfileAccessor.set(stepContext.context,'c1');
                                         if (tempText.indexOf('[c1]',0) != -1){profileName = 'c1'}
                                         qnaMakerOptions.scoreThreshold = 0.5;  
                                         qnaMakerOptions.top = 3; 
                                         qnaMakerOptions.strictFilters = null;

                                         }
                                    }                              
                                }
                          }
                    }


                   //Keyword2 -show clause

                   if (isNaN(str))
                         {
                         var strCon, strNo, strConNoFull;
                         profileName = await this._userProfileAccessor.get(stepContext.context,false)

                         var posnSpace = str.indexOf(' ',0);

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

                         if (posnSpace != -1)
                                      {
                                      if (str == 'c1 s' || str== 'p1 s' || str == 'Construction Contract 1st Ed 1999' || str == 'Plant & Design-Build Contract 1st Ed 1999' || str.indexOf('Stop search',0) != -1)  //prompts
                                           //standard conversions
                                           {
                                           if (str == 'c1 s'){str = 'c1s:0.0.0.0';}
                                           var strConNoFull = str;
                                           }
                                           else
                                           {
                                           if (profileName != false) {
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
                                           if (profileName != false) {
                                                strCon = profileName;}
                                                else
                                                {if (str == 'Construction Contract 1st Ed 1999'){
                                                      strCon = 'c1';}
                                                      else 
                                                      {if (str == 'Plant & Design-Build Contract 1st Ed 1999'){
                                                         strCon = 'p1';}
                                                      }
                                                 }
 
                                           if (isNaN(strNo) && strCon.indexOf('i',0) == -1){strCon = strCon + 'i';} //"c1i agreement" and not c1s
                  
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
                                  strConNoFull = strConNoFull.replace('c1i ','c1i:');
                                  strConNoFull = strConNoFull.replace('p1i ','p1i:');

                                  if (strConNoFull != 'c1s:0/0/0/0'){

                                       stepContext.context.activity.text = strConNoFull;
                                       }
                                  }

                         else
                         {

                         console.log("\n405 NUMBER STANDARD STRING  str = " + str);              

                         var strCon = '';
                         var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)

                         if (profileNameTemp == "c1" || profileNameTemp== "p1" )
                               {

                               strCon = profileNameTemp + ":";

                               }

                         var strNo = str.toString();


                         var strNoFull = strNo;
                         if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                         if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                         if (strNo.length == 5){strNoFull = strNoFull+'.0';}

                         var strConNoFull = strCon + strNoFull;

                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('c1 ','c1:');
                         strConNoFull = strConNoFull.replace('p1 ','p1:');

                         var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

                         if (searchTypeTemp == "advanced"){strConNoFull = 'Search active\n\n' + strConNoFull;}
                         stepContext.context.activity.text = strConNoFull;

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
        

     //Welcome
     profileName = await this._userProfileAccessor.get(stepContext.context,false)

     var didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);

     if (this._welcomedUserProperty != undefined){ 
            didBotWelcomedUser = await this._welcomedUserProperty.get(stepContext.context);
           
            if (didBotWelcomedUser == undefined){
             
                if (response.answers[0] == undefined){  
                  
                     if (profileName == false){  

                         response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Welcome to FIDICchatbot","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]} 
                         
                         } else { 
                         
                         }
                                                   
                     } else { 
                 
                     } 
                
                 } else {    
                    
                     
                 if (didBotWelcomedUser == 1){

                      if (response.answers[0] == undefined){
                                                                        
                          } else { 

                          response = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Guide","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}  

                          } 
                     
                      } else if (didBotWelcomedUser == 2){
                      
                          if (response.answers[0] == undefined){  
                    
                               if (profileName == false){  
                         
                                   response  = {"activeLearning Enabled":false,"answers":[{"questions":["none"],"answer":"Welcome to FIDICchatbot","score":1,"id":13446, "source":"Editorial","metadata":[],"context":{"isContextOnly":false}}]}                       
                                   } else { 
                         
                                   }
                                                   
                                } else { 
                     
                                }
                          }                        
                    }
              }

     
        console.log("\n693 ANSWER BEFORE PROCESSING response");
                 

        //Add clause number to prompts (for Messenger's 2 messages)
        str = response.answers[0].questions[0];
        if (str.indexOf('c1:',0) != -1 || str.indexOf('p1:',0) != -1)  //coming from clauses
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
                     promptAry[i] =  response.answers[0].context.prompts[i];
                     iTotal = i;
                     } 
                     else {break}
                  } 

             for (var i = 1; i < iTotal + 2; i++)
                  {
                  response.answers[0].context.prompts[i] =  promptAry[i-1];
                  }
              } 


        console.log("\n750 BEFORE PROCESSING");
 

        if (stepContext.context.activity.text == textTemp && textOrig.indexOf('c1si ',0) != -1)
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

               console.log("\n819 .....");

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

                                 if (metadataAry[i][j].name == 'category'){
                                      categoryAry.push(metadataAry[i][j].value);
                                      }
                                 } 
                            } 
                         } 
                    }


               response.answers[0].answer = "Search - select a category";

               //Stage 1 create prompts
          
               console.log("\n704END META response")

               if (categoryAry.length == 0)
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
                    for (var i = 0; i < categoryAry.length; i++) 
                         {
                         //shows all clauses, not collapsed clauses
                         var displayTextTemp = '[ ' + categoryAry[i] + ' ]'; //str in memoryfor advanced search pass 2
                         var qnaIdTemp = 2000 + i

                         var answerPrompt = {displayOrder:0,qna:null,displayText:displayTextTemp};

                         response.answers[0].context.prompts[i] = answerPrompt;

                         }
                    } 
               } 
         } 

    //End pass 1


    //Pass 2 - expands clauses

          console.log("\n918 START PASS 2");

           var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

           if (searchTypeTemp == "advanced1")   
               {

               for (var iTotal = 0; iTotal < 50; iTotal++) {  //find number of answers to run in reverse
                  if (response.answers[iTotal] == undefined)
                      {
                      break
                      }}

               var answerTitle, posnTitle, combinedAnswers = ''; 
               var answerPrompt = '';
               for (var i = 0; i < iTotal; i++) 
                  {
                  if (response.answers[i] != undefined){

                     answerTitle = response.answers[i].answer;

                     posnTitle = answerTitle.indexOf(': ',0);
                     answerTitle = answerTitle.substring(0,posnTitle);
                     if (i > 0){combinedAnswers = '\n\n' + combinedAnswers;}

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

             console.log("\n790 AFTER PROMPTS")

             await this._userSearchAccessor.set(stepContext.context, 'advanced')

             qnaMakerOptions.strictFilters = null; //reset

             response.answers[0].answer = combinedAnswers;

             var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

             if (searchTypeTemp == 'advanced')
                   {

                   var conTemp = await this._userProfileAccessor.get(stepContext.context,false)

                   conTemp = conTemp.replace('s','')

                   response.answers[0].context.prompts[iTotal] = {displayOrder:1,qna:null,displayText:'Stop search [' + conTemp +']'};
                   }

             console.log("\n1001 END EXPANSION response")

             }

         } 

        //End combine clauses for advanced search

        console.log("\n818 After processing");

        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;

        var searchTypeTemp = await this._userSearchAccessor.get(stepContext.context);

        if (searchTypeTemp == 'advanced')
             {
             response.answers[0].answer = 'Search active\n\n' + response.answers[0].answer;
             }

        stepContext.values[QnAData] = response.answers;

        var result = [];
        if (response.answers.length > 0) {
            result.push(response.answers[0]);
        }

        stepContext.values[QnAData] = result;

        return await stepContext.next(result); 

    }



    async checkForMultiTurnPrompt(stepContext, answerNoAnswerDeep) {


        if (stepContext.result != null && stepContext.result.length > 0) {

            var answer = stepContext.result[0];

            if (answer.questions[0].indexOf('c1:',0) != -1 || answer.questions[0].indexOf('p1:',0) != -1) 
                {
                var answerNoAnswerDeep = JSON.parse(JSON.stringify(answer));
                var answerNoAnswerDeepStore = JSON.parse(JSON.stringify(answer));
                answerNoAnswerDeep.answer = "" //remove answer
                var answer = JSON.parse(JSON.stringify(answerNoAnswerDeep)); //back to answer
                }

            //if ((answer.context != null && answer.context.prompts != null && answer.context.prompts.length > 0) || answer.questions[0].indexOf('c1:',0) != -1 || answer.questions[0].indexOf('p1:',0) != -1)
            if (answer.context != null && answer.context.prompts != null && answer.context.prompts.length > 0)
                {
                console.log("\n1052 OUT2 PROCESSING PROMPT")

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

                 var profileNameTemp = await this._userProfileAccessor.get(stepContext.context,false)

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

                if (answer.questions[0].indexOf('c1:',0) != -1 || answer.questions[0].indexOf('p1:',0) != -1) 
                   {
                   await stepContext.context.sendActivity(answerNoAnswerDeepStore.answer);
                   }

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

        console.log("\n1125 END END");

        var responses = stepContext.result;
        if (responses != null) {
            if (responses.length > 0) {

                await stepContext.context.sendActivity(responses[0].answer);

                } else {
                    
                await stepContext.context.sendActivity(qnaDialogResponseOptions.noAnswer);

                }
            
            return await stepContext.next();
            }
}

async changeContract(stepContext, userState) { 

       console.log("\n953 SAVE");

       var currentQuery = stepContext._info.values.currentQuery;
       var currentPosn = currentQuery.indexOf(':',0);    
       var currentContract = currentQuery.substring(0, currentPosn); 

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


