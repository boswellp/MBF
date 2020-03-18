// Copyright (c) Bricad Associates 2020

// code for c1
var qnaId_c1 = 2406;

var categoriesAry = ["agreement","certificate","clause","condition","contractor","DAB","defect","definition","document","duty","employer","engineer","equipment","failure","force-majeure","insurance","measure","obligation","part","particular","payment","personnel","programme","security","site","subcontract","suspension","taking-over","termination","test","time","value","variation"];

const {
    ComponentDialog,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { QnACardBuilder } = require('../utils/qnaCardBuilder');

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
const USER_PROFILE_PROPERTY = 'userProfile'; //MINE ADDED
const USER_SEARCH_TYPE = 'searchType'; //MINE ADDED
const USER_STRING_VALUE = 'stringValue'; //MINE ADDED

class QnAMakerMultiturnDialog extends ComponentDialog {
   
    //constructor(qnaService) {  //ORIG
    constructor(qnaService,userState) { //MINE
        super(QNAMAKER_MULTITURN_DIALOG);

        this._qnaMakerService = qnaService;
        
        this._userState = userState; //MINE ADDED
        this._userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY); //MINE ADDED
        this._userSearchAccessor = userState.createProperty(USER_SEARCH_TYPE); //MINE ADDED
        this._userStringAccessor = userState.createProperty(USER_STRING_VALUE); //MINE ADDED

        this.addDialog(new WaterfallDialog(QNAMAKER_DIALOG, [
            this.callGenerateAnswerAsync.bind(this),
            this.checkForMultiTurnPrompt.bind(this),
            this.displayQnAResult.bind(this),
            this.changeContract.bind(this) //MINE ADDED
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
            //qnaMakerOptions.context = qnaMakerOptions.context ? qnaMakerOptions.context : DefaultContext; //MINE
            //qnaMakerOptions.strictFilters = qnaMakerOptions.strictFilters ? qnaMakerOptions.strictFilters : DefaultStrictFilters; //MINE
        }
           
        console.log("\n\n86 ..........MULTITURN..............");

        var util = require('util')
        //console.log("\n106 MULTITURN this._userProfileAccessor  = " + util.inspect(this._userProfileAccessor))
        //console.log("\n106 MULTITURN this._userContractAccessor  = " + util.inspect(this._userContractAccessor))

        var JSONstringifythisuserState = JSON.stringify(this._userState);

        var utilInspectstepContext = util.inspect(stepContext);

        if (this._userProfileAccessor.profileName == undefined && JSONstringifythisuserState.indexOf('cons1',0) != -1) //cons1 comes from QnAMaker and not got profileName
             {
             this._userProfileAccessor.profileName = "c1";
             this._userSearchAccessor.searchType = "index";
             console.log ("\n100 MULTITURN cons1 from QnAMaker IN c1");
             //var utilProfileAccessor = util.inspect(this._userProfileAccessor);
             //console.log("119 utiluserProfileAccessor  = " + utilProfileAccessor )
             } 
             else if (JSONstringifythisuserState.indexOf('plant1',0) != -1){ //plant1 comes from QnAMaker
             this._userProfileAccessor.profileName = "p1";
             this._userSearchAccessor.searchType = "index";
             console.log ("\n107 MULTITURN plant1 from QnAMake IN p1");
             } 


        var gotContract = '';
        gotContract = this._userProfileAccessor.profileName;

        console.log("\n114 MULTITURN profileName  = " + this._userProfileAccessor.profileName)

        var str = stepContext.context.activity.text;

        console.log ("\n118 str = " + str + "; gotContract = " + gotContract + "; searchType = " + this._userSearchAccessor.searchType + "\n.................................................");
     



             console.log ("\n140 IN str = " + str);

             //SEARCH
             if ((gotContract != '' && str == 'c1s') || (gotContract != '' && str == 'c1 s')) 
 
                   //INDEX c1 i button or c1i typed in
                   {
                   console.log ("\n147 button c1 s or typed c1s str = " + str + '\n');
                   stepContext.context.activity.text = 'c1s:0/0/0/0';
                   this._userProfileAccessor.profileName = 'c1s';
                   this._userSearchAccessor.searchType = 'advanced';
                   }

                   else if ((gotContract != '' && str == 'p1s') || (gotContract != '' && str == 'p1 s')) 

                   //INDEX c1 i button or c1i typed in
                   {
                   console.log ("\n157 button p1 s or typed p1s str = " + str + '\n');
                   stepContext.context.activity.text = 'p1s:0/0/0/0';
                   this._userProfileAccessor.profileName = 'p1s';
                   this._userSearchAccessor.searchType = 'advanced';
                   }


                   //change contract if stored c1/p1
                   else if (gotContract == 'c1' && str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1)
                   {
                   console.log ("\n167 got c1 str = " + str + '\n');
                   stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';
                   this._userProfileAccessor.profileName = 'p1'; //change contract after restart
                   }

                   else if (gotContract == 'p1' && str.indexOf('Construction Contract 1st Ed 1999',0) != -1)
                   {
                   console.log ("\n174 got p1 str = " + str + '\n');
                   stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';
                   this._userProfileAccessor.profileName = 'c1'; //change contract after restart
                   } 
 
                    
                   //process string
  
                   else

                   {              
                   var strClean = str; 
                   console.log ("\n185 IN strClean = " + strClean);  

                   //keyword
                   if (isNaN(str)) 
                         {
                         var contractCode = this._userProfileAccessor.profileName;
                         var searchType = this._userSearchAccessor.searchType;
                         console.log("\n193 keyword str = " + str + '; contractCode = ' + contractCode + '; searchType = ' + searchType);
 
 

                         if (str.indexOf('Construction Contract',0) != -1)
                               {
                               console.log ("\n199 ...");
                               stepContext.context.activity.text = 'cons1'; //cons1 into userProfile.name
                               this._userProfileAccessor.profileName = 'c1'
                               console.log ("201 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                               }
                               else if (str.indexOf('Plant &',0) != -1 )
                               {
                               console.log ("\n206 ...");
                               stepContext.context.activity.text = 'plant1'; //cons1 into userProfile.name
                               this._userProfileAccessor.profileName = 'p1'
                               console.log ("208 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                               }

                               else if (str == 'c1s' || str == 'p1s') //SEARCH
                               {
                               console.log ("\n214 ...");
                               if (str != this._userProfileAccessor.profileName) //changing index for c1s to p1s
                                     {
                                     this._userProfileAccessor.profileName = str + ':0/0/0/0';
                                     this._userSearchAccessor.searchType = 'advanced';
                                     stepContext.context.activity.text = str;
                                     console.log ("218 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                      }

                                } 
          
                               //SEARCH consolidated clauses []
                               else if (contractCode != undefined && contractCode.indexOf('1s',0) != -1)
                               {
                               console.log ("\n230 ...");
                               var strTemp = str.replace(/\[/,'');
                               strTemp = strTemp.replace(/\]/,'');
                               strTemp = strTemp.trim();
                               if (categoriesAry.includes(strTemp))

                                    {
                                    qnaMakerOptions.strictFilters = [{name:'category',value:strTemp}]

                                    str = this._userStringAccessor.stringValue;  //use stored str
                                    stepContext.context.activity.text = str;

                                    this._userSearchAccessor.searchType = 'advanced1';  //go to collapsed clauses

                                    console.log ("244 SENT COLLAPSED stepContext.context.activity.text = " + stepContext.context.activity.text + " with qnaMakerOptions.strictFilters = " + JSON.stringify(qnaMakerOptions.strictFilters) + "to do advanced1 search\n");
                                    }
                                    else
                                    //for stop search
                                    {
                                    console.log ("248........");
                                    this._userStringAccessor.stringValue = str;  //store str for advanced search
                                    var tempText = stepContext.context.activity.text;
                                    console.log ("233 STOP SEARCH stepContext.context.activity.text = " + tempText);
                                    //reset on "Stop advanced search"
                                    if (tempText.indexOf('Stop search',0) != -1)
                                         {
                                         this._userSearchAccessor.searchType = '';
                                         this._userProfileAccessor.profileName = 'c1';
                                         if (tempText.indexOf('[c1]',0) != -1){contractCode = 'c1'}
                                         qnaMakerOptions.scoreThreshold = 0.5;  
                                         qnaMakerOptions.top = 3; 
                                         qnaMakerOptions.strictFilters = null;
                                         //qnaMakerOptions.strictFilters = [{name:'category',value:'prompt'}]
                                         console.log ("243 RESET AFTER ADVANCED SEARCH - contractCode = " + contractCode); 
                                         }

                                    }
                               
                                }

                                else if (contractCode != undefined)
                                {
                                if ((contractCode.indexOf('1s',0) != -1 && str == 'c1') || (contractCode.indexOf('1s',0) != -1 && str == 'p1')) //leave index
                                     {  
                                     stepContext.context.activity.text = str;
                                     this._userProfileAccessor.profileName = str; //change index to c1, p1
                                     this._userSearchAccessor.searchType = 'index';
                                     console.log ("253 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                      }
                                      else if (contractCode.indexOf('1s',0) != -1) //got contact code + str
                                      {
                                      stepContext.context.activity.text = str;
                                          console.log ("258 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                       }
                                 }


                                 //KEYWORD options are "c1" "c1 agreement" "agreement" "c1 2.34"

                                 else
                                 {
                                 var strCon, strNo, strConNoFull;
                                 console.log("\n270 KEYWORD strClean = " + strClean + '; contractCode = ' + contractCode);
                                 var posnSpace = strClean.indexOf(' ',0);
                                 console.log ("272 posnSpace =" + posnSpace);

                                 if (posnSpace != -1)  //have space
                                      {
                                      strCon = strClean.substring(0,posnSpace); //for "c1 agree" and "c1 2.34"
                                      strNo = strClean.substring(posnSpace+1,strClean.length);
                                      this._userProfileAccessor.profileName = strCon;
                                      console.log("\n340 profileName = " + this._userProfileAccessor.profileName)
                                      }
                                      else  //no space
                                      {
                                      if (strClean == 'help' || strClean == 'start' || strClean.indexOf('Stop search',0) != -1)  //prompts
                                           {
                                           strConNoFull = strClean;
                                           }
                                           else
                                           {
                                           strCon = strClean;
                                           if (strCon == "c1" || strCon == "p1" ) // "c1"
                                                 {
                                                 strNo = '';
                                                 }
                                                 else // "agreement"
                                                 {
                                                 strCon = '';
                                                 strNo = strCon;
                                                 }
                                            console.log ("304 strCon =" + strCon);
                                            console.log ("305 strNo =" + strNo);

                                            var strConNoFull = strNo;
                                            if (posnSpace != -1) //have space
                                                 { 
                                                 strConNoFull = strCon + ' ';
                                                 if (!isNaN(strNo)) //"c1 2.34"
                                                      {
                                                      if (strNo.length == 1){strNoFull = strConNoFull+'.0.0.0';}
                                                      if (strNo.length == 3){strNoFull = strConNoFull+'.0.0';}
                                                      if (strNo.length == 5){strNoFull = strConNoFull+'.0.0';}
                                                      }
                                                      else // "c1 agreement"
                                                      {
                                                      strConNoFull = strConNoFull + strNo
                                                      }
                                                  }
                                                  else  //no space
                                                  {
                                                  strConNoFull = strCon + ':'; // strCo = "c1" or strNo = "agreement"
                                                  }

                                            console.log("322 strConNoFull = " + strConNoFull);

                                            strConNoFull = strConNoFull.replace('.','\/');
                                            strConNoFull = strConNoFull.replace('.','\/');
                                            strConNoFull = strConNoFull.replace('.','\/');
                                            strConNoFull = strConNoFull.replace('.','\/');
                                            strConNoFull = strConNoFull.replace('c1 ','c1:');
                                            strConNoFull = strConNoFull.replace('p1 ','p1:');
                                            }

                                     console.log("332 A keyword strConNoFull = " + strConNoFull);

                                     stepContext.context.activity.text = strConNoFull;

                                     console.log ("336 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                                     }
                               }
                         }

                         else
                         {

                         console.log("\n348 A clause number str = " + str);              

                         var strCon = '';


                         if (this._userProfileAccessor.profileName == "c1" || this._userProfileAccessor.profileName == "p1" )
                               {
                               console.log("\n412 profileName = " + this._userProfileAccessor.profileName)
                               strCon = this._userProfileAccessor.profileName + ":";
                               console.log ("414 strCon =" + strCon);
                               }

                         var strNo = str.toString();
                         console.log ("362 strNo =" + strNo);

                         var strNoFull = strNo;
                         if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                         if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                         if (strNo.length == 5){strNoFull = strNoFull+'.0.0';}
                         console.log ("368 strNoFull =" + strNoFull);

                         var strConNoFull = strCon + strNoFull;

                         console.log("372 strConNoFull = " + strConNoFull);

                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('c1 ','c1:');
                         strConNoFull = strConNoFull.replace('p1 ','p1:');

                         console.log("381 A keyword strConNoFull = " + strConNoFull);

                         stepContext.context.activity.text = strConNoFull;

                         console.log ("385 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);

                         }
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


//Metadata

        console.log("\n437 qnaMakerOptions START = " + JSON.stringify(qnaMakerOptions));

//Get answers
//First pass - set metadata

        if (contractCode != undefined && this._userSearchAccessor.searchType == "advanced") //change first pass to searchType??
             {
             if (contractCode != undefined)
                  {
                  if (contractCode.indexOf('1s',0) != -1)  
                       {

                       console.log("\n449 qnaMakerOptions = " + JSON.stringify(qnaMakerOptions));

                       qnaMakerOptions.scoreThreshold = 0.1; 
                       qnaMakerOptions.top = 50;

                       }
                   }
            }
            else
            {
            if (qnaMakerOptions.strictFilters == null) //WORKS, start with nothing defined
                 {
                 //qnaMakerOptions.strictFilters = [{name:'category',value:'contents'}];
                 }
                 else //not null so can change name and value
                 {

                 //qnaMakerOptions.strictFilters[0].name = '' 
                 //qnaMakerOptions.strictFilters[0].value = ''
                 }

             }


        console.log("\n475 qnaMakerOptions END = " + JSON.stringify(qnaMakerOptions));

        console.log("\n477 stepContext.context.activity.text END = " + stepContext.context.activity.text);

        var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);

        //console.log("\n482 response = " + JSON.stringify(response));
        console.log("\n483 response = HERE");

        if (response.answers[0] == undefined)  //word not in document (anwsers standard error from qnamaker)
             {
             console.log("\n487 response undefined (WORD NOT IN DOC) ERROR HANDLING NEEDED - STANDARD ERROR SHOWN\n....................................");
             }


else // çrror handling - word not in doc - goes to end
{

        var responseAnswer = JSON.stringify(response.answers[0].answer)


//First pass advanced search (get categories for xxxxxx into metatDataAry)

        //var metadataAry = [[],[]];
        var metadataAry = new Array(50).fill(null).map(()=>new Array(5).fill(null));


        if (contractCode != undefined && responseAnswer.indexOf('Choose a category',0) == -1 && this._userSearchAccessor.searchType == "advanced") //change first pass to searchType??
           {
           if (contractCode.indexOf('1s',0) != -1)  
               {

               response.answers[0].answer = "Search - select a category";  //first pass

               //console.log("\n497 response.answers IN = " + JSON.stringify(response.answers));

               //console.log("\n499 response.answers[0].context.prompts = " + JSON.stringify(response.answers[0].context.prompts));
               //console.log("\n500response.answers[1].context.prompts = " + JSON.stringify(response.answers[1].context.prompts));


               for (var i = 0; i < 50; i++) 
                  {
                  //console.log("\n514 i, response.answers[i] = " + i + "; " + JSON.stringify(response.answers[i]));
                  if (response.answers[i] != undefined)
                      {
                      console.log("\n529 i, response.answers[i] = " + i + "; " + JSON.stringify(response.answers[i]));
                      for (var j = 0; j < 5; j++) 
                          {
                          //console.log("\n511 contractCode i, j, response.answers[i].metadata[j] = " + contractCode + "; " + i + "; " + j + "; " + JSON.stringify(response.answers[i].metadata[j]));

                          var qCon = response.answers[i].questions[0];
                          qCon = qCon.substring(0, qCon.indexOf(':',0));
                          var contractCodeTemp = contractCode.replace('s','')

                          if (response.answers[i].metadata[j] != undefined && contractCodeTemp == qCon)
                              {
                              //console.log("\n520 i, j, response.answers[i].metadata[j] = " + i + "; " + j + "; " + JSON.stringify(response.answers[i].metadata[j]));
                              //console.log("\n521 i, j, metadataAry[i][j] = " + i + "; " + j + "; " + metadataAry[i][j]);

                              metadataAry[i][j] = response.answers[i].metadata[j];

                              //console.log("\n525 i, j, metadataAry[i][j] = " + i + "; " + j + "; " + metadataAry[i][j]);

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
                   } //end for


//Pass 1 - get categories into an array

               console.log("\n 543 metadataAry = " + JSON.stringify(metadataAry) + "\n..................................");

               var categoryAry = []; 

               for (var i = 0; i < 50; i++)
                    {
                    for (var j = 0; j < 5; j++)
                        {

                        if (metadataAry[i][j] != null)
                            {
                            var valueTemp = metadataAry[i][j].value;
                            //console.log("\n555 i, j, value = " + i + "; " + j + "; " + valueTemp);
                            //console.log("556 metadataAry[i][j] = " + i + "; " + j + "; " +  JSON.stringify(metadataAry[i][j].name) + "  " + JSON.stringify(metadataAry[i][j].value))

                            var inAry = false;
                            for (var k = 0; k < 50; k++)
                                {
                                //console.log("\n\n661 categoryAry[k] = " + inAry + "; " + i + "; " + j + "; "  + k +"; " + categoryAry[k]);
                                //console.log("662 metadataAry[i][j] value = " + inAry + "; " + i + "; " + j + "; " + JSON.stringify(metadataAry[i][j].value) + "\n")

                                if (categoryAry[k] == valueTemp)
                                     {
                                     inAry = true;
                                     }
                                     else if (inAry != true)
                                     {inAry = false;}
                                 }

                            if (inAry == false)
                                 {
                                 console.log("\n578 i j metadataAry[i][j]= " + i + "; " + j + "; " + JSON.stringify(metadataAry[i][j]));

                                 if (metadataAry[i][j].name == 'category'){
                                      categoryAry.push(metadataAry[i][j].value);
                                      console.log("582 value .................. = " + metadataAry[i][j].value)
                                      }

                                 } //if

                            } //if
                         } //for
                    }//for



//Pass 1 create prompts

               console.log("\n571 pass1 metadataAry = " + JSON.stringify(metadataAry));
               console.log("\n572 pass1 categoryAry = " + JSON.stringify(categoryAry));
               console.log("\n573 response.answers[0] = " + JSON.stringify(response.answers[0]));

               /// Error handling in collapse (remove prompts if word not in a categotry - test keyword is "eeeeee")

               if (categoryAry.length == 0)
                    {
                    for (var i = 0; i < 20; i++) 
                        {
                        delete response.answers[0].context.prompts[i];
                        }

                    response.answers[0].context.prompts[0] = {displayOrder:0,qna:null,displayText:'c1 s'};

                    if (contractCode.indexOf('c1',0) != -1 || this._userProfileAccessor.profileName.indexOf('c1',0) != -1)
                        {
                        response.answers[0].context.prompts[1] = {displayOrder:1,qna:null,displayText:'Stop search [c1]'};
                        }
                    }
                    else
                    {

                    for (var i = 0; i < categoryAry.length; i++) 
                         {
                         //shows all clauses, not collapsed clauses
                         var displayTextTemp = '[ ' + categoryAry[i] + ' ]'; //str in memoryfor advanced search pass 2
                         var qnaIdTemp = 2000 + i

                         var answerPrompt = {displayOrder:0,qnaId:qnaIdTemp,qna:null,displayText:displayTextTemp}; //// 22222 is any id

                         response.answers[0].context.prompts[i] = answerPrompt;

                         console.log("\n609 answerPrompt = " + JSON.stringify(answerPrompt));

                         } //end for

                    } //end if

               } //if

         console.log("\n617 END PASS 1\n.................................\n");
         } //if


//End pass 1


//Pass 2 - collapses clauses with advanced search for xxxxx

        if (contractCode != undefined)
           {if (contractCode.indexOf('1s',0) != -1 && this._userSearchAccessor.searchType == "advanced1")  
               {
               console.log("\n630 this._userSearchAccessor.searchType = " + this._userSearchAccessor.searchType +"\n......................................\n")

            
               for (var iTotal = 0; iTotal < 50; iTotal++) {  //find number of answers to run in reverse
                  if (response.answers[iTotal] == undefined)
                      {
                      break
                      }
                  }
               var answerTitle, posnTitle, combinedAnswers = ''; 
               var answerPrompt = '';
               for (var i = 0; i < iTotal; i++) 
                  {
                  if (response.answers[i] != undefined)
                     {
                     answerTitle = response.answers[i].answer;

                     posnTitle = answerTitle.indexOf(': ',0);
                     answerTitle = answerTitle.substring(0,posnTitle);
                     if (i > 0){combinedAnswers = '\n\n' + combinedAnswers;}

                     combinedAnswers = answerTitle + combinedAnswers;
                     console.log("\n649 i, combinedAnswers = " + i + " ; "  + combinedAnswers)

                     var answerId = response.answers[i].id;

                     var questionStr = response.answers[i].questions;

                     questionStr = questionStr.toString();

                     questionStr = questionStr.replace(/\/0/g,'');
                     questionStr = questionStr.replace(/\//g,'.');
                     questionStr = questionStr.replace(':',' ');

                     var metadataStr = response.answers[i].metadata;
                     console.log("\n664 i, metadataStr = " + i + " ; " + metadataStr)
                     metadataStr = metadataStr.toString();
                     console.log("\n666 i, medatadataStrtoString = " + i + " ; " + JSON.stringify(metadataStr))


                     // var answerPrompt = {"displayOrder":0,"qnaId":2363,"qna":null,"displayText":"p1 0"};  //default

                      answerPrompt = {displayOrder:0,qnaId:answerId,qna:null,displayText:questionStr};

                      response.answers[0].context.prompts[iTotal-1-i] = answerPrompt;

                      console.log("\n689 iTotal-1-i, answerPrompt = " + iTotal-1-i + " ; " + answerPrompt)

                     }
                     else
                     {break}

                  } //end for




             if (this._userSearchAccessor.searchType == 'advanced1'){combinedAnswers = "Advanced search\n\n" + combinedAnswers;}
             this._userSearchAccessor.searchType = 'advanced';  //reset
             qnaMakerOptions.strictFilters = null; //reset

             response.answers[0].answer = combinedAnswers;

             if (contractCode.indexOf('c1',0) != -1 || this._userProfileAccessor.profileName.indexOf('c1',0) != -1)
                 {
                 response.answers[0].context.prompts[iTotal] = {"displayOrder":0,"qna":null,"displayText":"Stop search [c1]"}

                 }

             }
        };

} //End error handling - word not in doc

//End combine clauses for advanced search


        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;

        console.log("\n726 dialogOptions = " + JSON.stringify(dialogOptions));
        console.log("\n727response.answers = HERE = " + response.answers);

        stepContext.values[QnAData] = response.answers;

        var result = [];
        if (response.answers.length > 0) {
            result.push(response.answers[0]);
        }

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

                // Get multi-turn prompts card activity.
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

        //console.log("\n783 qnaDialogResponseOptions = " + JSON.stringify(qnaDialogResponseOptions));

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
    
    
}

async changeContract(stepContext, userState) { 

       console.log("\n\n817 ..........SAVE..............");

       var currentQuery = stepContext._info.values.currentQuery;
       var currentPosn = currentQuery.indexOf(':',0);
       
       var currentContract = currentQuery.substring(0, currentPosn); 

       console.log("\n842 currentQuery  = " + currentQuery);
       console.log("\n843 currentContract  = " + currentContract + "\n");
       console.log("\n844 ProfileAccessor.profileName = " + this._userProfileAccessor.profileName);
       console.log("\n845 userSearchAccessor.searchType = " + this._userSearchAccessor.searchType);


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
