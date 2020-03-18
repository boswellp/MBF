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

        var str = stepContext.context.activity.text;
        var profileName = this._userProfileAccessor.profileName;

        //console.log("\n114 MULTITURN profileName  = " + profileName)


        //console.log ("118 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);

        console.log ("\n118 str = " + str + "; profileName = " + profileName + "; searchType = " + this._userSearchAccessor.searchType + "\n.................................................");
     



             console.log ("\n123 IN str = " + str);

             //SEARCH
             if ((profileName != '' && str == 'c1s') || (profileName != '' && str == 'c1 s')) 
 
                   //INDEX c1 i button or c1i typed in
                   {
                   console.log ("\n130 button c1 s or typed c1s str = " + str + '\n');
                   stepContext.context.activity.text = 'c1s:0/0/0/0';
                   this._userProfileAccessor.profileName = 'c1s';
                   this._userSearchAccessor.searchType = 'advanced';
                   console.log ("137 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                   }

                   else if ((profileName != '' && str == 'p1s') || (profileName != '' && str == 'p1 s')) 

                   //INDEX c1 i button or c1i typed in
                   {
                   console.log ("\n140 button p1 s or typed p1s str = " + str + '\n');
                   stepContext.context.activity.text = 'p1s:0/0/0/0';
                   this._userProfileAccessor.profileName = 'p1s';
                   this._userSearchAccessor.searchType = 'advanced';
                   }


                   //change contract if stored c1/p1
                   else if (profileName == 'c1' && str.indexOf('Plant & Design-Build Contract 1st Ed 1999',0) != -1)
                   {
                   console.log ("\n150 got c1 str = " + str + '\n');
                   stepContext.context.activity.text = 'Plant & Design-Build Contract 1st Ed 1999';
                   this._userProfileAccessor.profileName = 'p1'; //change contract after restart
                   }

                   else if (profileName == 'p1' && str.indexOf('Construction Contract 1st Ed 1999',0) != -1)
                   {
                   console.log ("\n158 got p1 str = " + str + '\n');
                   stepContext.context.activity.text = 'Construction Contract 1st Ed 1999';
                   this._userProfileAccessor.profileName = 'c1'; //change contract after restart
                   } 
 
                    
                   //process string
  
                   else

                   {              
                   var strClean = str; 
                   console.log ("\n170 IN strClean = " + strClean);  

                   //keyword1
                   if (isNaN(str)) 
                         {
                         var profileName = this._userProfileAccessor.profileName;
                         var searchType = this._userSearchAccessor.searchType;
                         if (searchType == 'advanced2')
                               {
                               if (profileName != undefined){profileName = profileName.replace('s','')} //to enable normal clause display
                               }
                         console.log("\n181 keyword1 str = " + str + '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);
 
 

                         if (str.indexOf('Construction Contract',0) != -1)
                               {
                               console.log ("\n186 ...");
                               stepContext.context.activity.text = 'cons1'; //cons1 into userProfile.name
                               this._userProfileAccessor.profileName = 'c1'
                               console.log ("185 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                               }
                               else if (str.indexOf('Plant &',0) != -1 )
                               {
                               console.log ("\n193 ...");
                               stepContext.context.activity.text = 'plant1'; //cons1 into userProfile.name
                               this._userProfileAccessor.profileName = 'p1'
                               console.log ("196 SENT stepContext.context.activity.text = " + stepContext.context.activity.text);
                               }

                               else if (str == 'c1s' || str == 'p1s') //SEARCH
                               {
                               console.log ("\n201 ...");
                               if (str != this._userProfileAccessor.profileName) //changing index for c1s to p1s
                                     {
                                     this._userProfileAccessor.profileName = str + ':0/0/0/0';
                                     this._userSearchAccessor.searchType = 'advanced';
                                     stepContext.context.activity.text = str;
                                     console.log ("2203 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                      }

                                } 
          
                               //SEARCH consolidated clauses []
                               else if (profileName != undefined && profileName.indexOf('1s',0) != -1)
                               {
                               console.log ("\n215 ...");
                               var strTemp = str.replace(/\[/,'');
                               strTemp = strTemp.replace(/\]/,'');
                               strTemp = strTemp.trim();
                               if (categoriesAry.includes(strTemp))

                                    {
                                    qnaMakerOptions.strictFilters = [{name:'category',value:strTemp}]

                                    str = this._userStringAccessor.stringValue;  //use stored str
                                    stepContext.context.activity.text = str;

                                    this._userSearchAccessor.searchType = 'advanced1';  //go to collapsed clauses

                                    console.log ("225 SENT COLLAPSED stepContext.context.activity.text = " + stepContext.context.activity.text + " with qnaMakerOptions.strictFilters = " + JSON.stringify(qnaMakerOptions.strictFilters) + "to do advanced1 search\n");
                                    }
                                    else
                                    //for stop search
                                    {
                                    console.log ("230........");
                                    this._userStringAccessor.stringValue = str;  //store str for advanced search
                                    var tempText = stepContext.context.activity.text;
                                    console.log ("233 STOP SEARCH stepContext.context.activity.text = " + tempText);
                                    //reset on "Stop advanced search"
                                    if (tempText.indexOf('Stop search',0) != -1)
                                         {
                                         this._userSearchAccessor.searchType = '';
                                         this._userProfileAccessor.profileName = 'c1';
                                         if (tempText.indexOf('[c1]',0) != -1){profileName = 'c1'}
                                         qnaMakerOptions.scoreThreshold = 0.5;  
                                         qnaMakerOptions.top = 3; 
                                         qnaMakerOptions.strictFilters = null;
                                         //qnaMakerOptions.strictFilters = [{name:'category',value:'prompt'}]
                                         console.log ("243 RESET AFTER ADVANCED SEARCH - profileName = " + profileName); 
                                         }

                                    }
                               
                                }
                           }//MOVE
}///MOVE2

/*
                   if (profileName != undefined) //MOVE

                                //else if (profileName != undefined) //MOVE
                                {
                                console.log ("263........");
                                console.log("\n264 PRE-STRING activity.text = " + stepContext.context.activity.text + '; profileName = ' + this._userProfileAccessor.profileName + '; searchType = ' + this._userSearchAccessor.searchType);
                                if ((profileName.indexOf('1s',0) != -1 && str == 'c1') || (profileName.indexOf('1s',0) != -1 && str == 'p1')) //leave index
                                     {  
                                     stepContext.context.activity.text = str;
                                     this._userProfileAccessor.profileName = str; //change index to c1, p1
                                     this._userSearchAccessor.searchType = '';
                                     console.log ("272 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                      }
                                      else if (profileName.indexOf('1s',0) != -1) //got contact code + str
                                      {
                                      stepContext.context.activity.text = str;
                                      console.log ("277 SENT INDEX stepContext.context.activity.text = " + stepContext.context.activity.text);
                                      }
                                 }
*/
                         //} MOVE


                   //keyword2 -show clause
                   //if (str.indexOf('[ ',0) == -1 && this._userProfileAccessor.profileName.indexOf('s') == -1) { // not collapse pass 2
                   if (isNaN(str))
                         {
                         var strCon, strNo, strConNoFull, strClean = str;
                         profileName = this._userProfileAccessor.profileName;
                         console.log("\n288 KEYWORD STANDARD STRING strClean = " + strClean + '; profileName = ' + profileName);

                         var posnSpace = strClean.indexOf(' ',0);
                         console.log ("291 posnSpace =" + posnSpace);

                         if (posnSpace != -1)  //have space
                                      {
                                      strCon = strClean.substring(0,posnSpace); //for "c1 agree"
                                      strNo = strClean.substring(posnSpace+1,strClean.length);
                                      }
                                      else  //no space
                                      {
                                      strCon = '';
                                      strNo = strClean;
                                      }

                         if (posnSpace != -1)  //have space "c1 agreement" "c1i agreement" "c1 2.3" "c1i 2.3
                                      {
                                      if (strClean == 'c1 s' || strClean == 'p1 s' || strClean == 'Construction Contract 1st Ed 1999' || strClean == 'Plant & Design-Build Contract 1st Ed 1999' || strClean.indexOf('Stop search',0) != -1)  //prompts
                                           //standard conversions
                                           {
                                           if (strClean == 'c1 s'){strClean = 'c1s:0.0.0.0';}
                                           var strConNoFull = strClean;
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
                                                {if (strClean == 'Construction Contract 1st Ed 1999'){
                                                    strCon = 'c1';}
                                                    else 
                                                    {if (strClean == 'Plant & Design-Build Contract 1st Ed 1999'){
                                                        strCon = 'p1';}
                                                    }
                                                 }

                                           if (isNaN(strNo) && strCon.indexOf('i',0) == -1){strCon = strCon + 'i';} //"c1i agreement"
                                           var strConNoFull = strCon + ' ' + strNo; 
                                           } 
                                       }

                                       else //no space

                                       {
                                       if (strClean == 'c1s' || strClean == 'p1s' ||strClean == 'c1' || strClean == 'c2' || strClean == 'help' || strClean == 'start')  //prompts
                                           //standard conversions
                                           {
                                           if (strClean == 'c1'){strClean = 'cons1';}
                                           if (strClean == 'p1'){strClean = 'plant1';}
                                           var strConNoFull = strClean;
                                           }
                                           else // "agreement" "2.1"
                                           {
                                           if (profileName != undefined) {
                                                strCon = profileName;}
                                                else
                                                {if (strClean == 'Construction Contract 1st Ed 1999'){
                                                      strCon = 'c1';}
                                                      else 
                                                      {if (strClean == 'Plant & Design-Build Contract 1st Ed 1999'){
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
                         //strConNoFull = strConNoFull.replace('c1s ','c1:');
                         //strConNoFull = strConNoFull.replace('p1s ','p1:');
                         strConNoFull = strConNoFull.replace('c1i ','c1i:');
                         strConNoFull = strConNoFull.replace('p1i ','p1i:');

                         console.log("365 strConNoFull = " + strConNoFull);

if (strConNoFull != 'c1s:0/0/0/0'){

                         stepContext.context.activity.text = strConNoFull;



                         console.log ("373 SENT STANDARD STRING stepContext.context.activity.text = " + stepContext.context.activity.text + "\n...................................\n");
}

                         }


                         else
                         {

                         console.log("\n382 NUMBER STANDARD STRING  str = " + str);              

                         var strCon = '';


                         if (this._userProfileAccessor.profileName == "c1" || this._userProfileAccessor.profileName == "p1" )
                               {
                               console.log("\n389 profileName = " + this._userProfileAccessor.profileName)
                               strCon = this._userProfileAccessor.profileName + ":";
                               console.log ("391 strCon =" + strCon);
                               }

                         var strNo = str.toString();
                         console.log ("395 strNo =" + strNo);

                         var strNoFull = strNo;
                         if (strNo.length == 1){strNoFull = strNoFull+'.0.0.0';}
                         if (strNo.length == 3){strNoFull = strNoFull+'.0.0';}
                         if (strNo.length == 5){strNoFull = strNoFull+'.0';}
                         console.log ("401 strNoFull =" + strNoFull);

                         var strConNoFull = strCon + strNoFull;

                         console.log("405 strConNoFull = " + strConNoFull);

                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('.','\/');
                         strConNoFull = strConNoFull.replace('c1 ','c1:');
                         strConNoFull = strConNoFull.replace('p1 ','p1:');

                         console.log("414 A keyword strConNoFull = " + strConNoFull);

                         if (this._userSearchAccessor.searchType == "advanced"){strConNoFull = 'Search active\n\n' + strConNoFull;}
                         stepContext.context.activity.text = strConNoFull;

                         console.log ("428 SENT STANDARD STRING stepContext.context.activity.text = " + stepContext.context.activity.text);

                         }
                   ///// }  //MOVE2
                    //}  //not collapse

 
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
//Get answers
//First pass - set metadata

        console.log("\n448 qnaMakerOptions START = " + JSON.stringify(qnaMakerOptions));

        if (profileName != undefined && this._userSearchAccessor.searchType == "advanced") //change first pass to searchType??
             {
             if (profileName != undefined)
                  {
                  if (profileName.indexOf('1s',0) != -1)  
                       {

                       console.log("\n457 qnaMakerOptions = " + JSON.stringify(qnaMakerOptions));

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
        console.log("\n488 qnaMakerOptions END = " + JSON.stringify(qnaMakerOptions) + "\n...............................\n");


        //remove c1si for search
        var textTemp = stepContext.context.activity.text;
        var textOrig = stepContext.context.activity.text;

        textTemp = textTemp.replace('c1si ','')
        stepContext.context.activity.text = textTemp;

        var response = await this._qnaMakerService.getAnswersRaw(stepContext.context, qnaMakerOptions);


        


        console.log("\n506 textOrig = " + textOrig + "; textTemp = " + textTemp + "; activity.text = " + stepContext.context.activity.text+ '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);

        //console.log("\n508 response.answers[0] = " + JSON.stringify(response.answers[0]))
        console.log("\n510 response.answers[0].answer = " + JSON.stringify(response.answers[0].answer));
        console.log("\n511 response = HERE");


       //if (stepContext.context.activity.text == "c1si xx") //works
       if (stepContext.context.activity.text == textTemp && textOrig.indexOf('c1si ',0) != -1)
             {


             console.log("\n521 standard response overruled for advanced search categories - response undefined (WORD NOT IN DOC) ERROR HANDLING NEEDED - STANDARD ERROR SHOWN\n....................................");
             //}


//else // Error handling - word not in doc - goes to end
//{
console.log("\n527 Error handling - word not in doc - executes to end");



        var responseAnswer = JSON.stringify(response.answers[0].answer)



//First pass advanced search (get categories for xxxxxx into metatDataAry)

        console.log("\n533 activity.text = " + stepContext.context.activity.text+ '; profileNameStored = ' + this._userProfileAccessor.profileName + '; searchTypeStored = ' + this._userSearchAccessor.searchType);

        //var metadataAry = [[],[]];
        var metadataAry = new Array(50).fill(null).map(()=>new Array(5).fill(null));


        if (this._userProfileAccessor.profileName != undefined && responseAnswer.indexOf('Choose a category',0) == -1 && this._userSearchAccessor.searchType == "advanced") //change first pass to searchType??
           {
           if (this._userProfileAccessor.profileName.indexOf('1s',0) != -1)  
               {

               console.log("\n538 in 1st pass answer: Search - select a category ");

               response.answers[0].answer = "Search - select a category";  //first pass

               //console.log("\n497 response.answers IN = " + JSON.stringify(response.answers));
               //console.log("\n499 response.answers[0].context.prompts = " + JSON.stringify(response.answers[0].context.prompts));
               //console.log("\n500response.answers[1].context.prompts = " + JSON.stringify(response.answers[1].context.prompts));


               for (var i = 0; i < 50; i++) 
                  {
                  //console.log("\n514 i, response.answers[i] = " + i + "; " + JSON.stringify(response.answers[i]));
                  if (response.answers[i] != undefined)
                      {
                      //console.log("\n529 i, response.answers[i] = " + i + "; " + JSON.stringify(response.answers[i]));
                      for (var j = 0; j < 5; j++) 
                          {
                          //console.log("\n511 profileName i, j, response.answers[i].metadata[j] = " + profileName + "; " + i + "; " + j + "; " + JSON.stringify(response.answers[i].metadata[j]));

                          var qCon = response.answers[i].questions[0];
                          qCon = qCon.substring(0, qCon.indexOf(':',0));
                          var profileNameTemp = profileName.replace('s','')

                          if (response.answers[i].metadata[j] != undefined && profileNameTemp == qCon)
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

               //console.log("\n 561 metadataAry = " + JSON.stringify(metadataAry) + "\n..................................");

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

               console.log("\n573 pass1 metadataAry = " + JSON.stringify(metadataAry));
               console.log("\n574 pass1 categoryAry = " + JSON.stringify(categoryAry));
               console.log("\n575 response.answers[0] = " + JSON.stringify(response.answers[0]));

               /// Error handling in collapse (remove prompts if word not in a categotry - test keyword is "eeeeee")

               if (categoryAry.length == 0)
                    {
                    for (var i = 0; i < 20; i++) 
                        {
                        delete response.answers[0].context.prompts[i];
                        }

                    response.answers[0].context.prompts[0] = {displayOrder:0,qna:null,displayText:'c1 s'};

                    if (profileName.indexOf('c1',0) != -1 || this._userProfileAccessor.profileName.indexOf('c1',0) != -1)
                        {
                        response.answers[0].context.prompts[1] = {displayOrder:1,qna:null,displayText:'Stop search [c1]'};
                        }

                    console.log("\n593 answerPrompt (categoryAry.length=0) = " + JSON.stringify(answerPrompt));
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

                         console.log("\n608 answerPrompt(categoryAry.length>0) = " + JSON.stringify(answerPrompt));

                         } //end for

                    } //end if

               } //if

         console.log("\n617 END PASS 1\n.................................\n");
         } //if


//End pass 1


//Pass 2 - collapses clauses with advanced search for xxxxx

        if (profileName != undefined)
           {if (profileName.indexOf('1s',0) != -1 && this._userSearchAccessor.searchType == "advanced1")  
               {
               console.log("\n628 this._userSearchAccessor.searchType = " + this._userSearchAccessor.searchType +"\n......................................\n")

            
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
                     console.log("\n650 i, combinedAnswers = " + i + " ; "  + combinedAnswers)

                     var answerId = response.answers[i].id;

                     var questionStr = response.answers[i].questions;

                     questionStr = questionStr.toString();

                     questionStr = questionStr.replace(/\/0/g,'');
                     questionStr = questionStr.replace(/\//g,'.');
                     questionStr = questionStr.replace(':',' ');

                     var metadataStr = response.answers[i].metadata;
                     console.log("\n663 i, metadataStr = " + i + " ; " + metadataStr)
                     metadataStr = metadataStr.toString();
                     console.log("\n665 i, medatadataStrtoString = " + i + " ; " + JSON.stringify(metadataStr))


                     // var answerPrompt = {"displayOrder":0,"qnaId":2363,"qna":null,"displayText":"p1 0"};  //default

                     //answerPrompt = {displayOrder:0,qnaId:answerId,qna:null,displayText:questionStr};
                     answerPrompt = {displayOrder:0, qna:null,displayText:questionStr};
                     var iCount = iTotal-1-i;
                     console.log("\n672 answerPrompt = " + JSON.stringify(answerPrompt))                     
                     console.log("\n673 iTotal-1-i = " + iCount)

                     response.answers[0].context.prompts[iCount] = answerPrompt;

                     console.log("\n677 iTotal-1-i = " + iCount)



                     }
                     else
                     {break}

                  } //end for




             //if (this._userSearchAccessor.searchType == 'advanced1'){combinedAnswers = "Advanced search\n\n" + combinedAnswers;}

             this._userSearchAccessor.searchType = 'advanced';  //reset to advanced for normal clause display

             qnaMakerOptions.strictFilters = null; //reset

             response.answers[0].answer = combinedAnswers;

             if (profileName.indexOf('c1',0) != -1 || this._userProfileAccessor.profileName.indexOf('c1',0) != -1)
                 {
                 response.answers[0].context.prompts[iTotal] = {"displayOrder":0,"qna":null,"displayText":"Stop search [c1]"}

                 }

             }
        };

} //End error handling - word not in doc

//End combine clauses for advanced search



        dialogOptions[PreviousQnAId] = -1;
        stepContext.activeDialog.state.options = dialogOptions;

        if (this._userSearchAccessor.searchType == 'advanced')
             {
             response.answers[0].answer = 'Search active\n\n' + response.answers[0].answer;
             }

        console.log("\n793 dialogOptions = " + JSON.stringify(dialogOptions));
        //console.log("\n754response.answers = HERE = " + JSON.stringify(response.answers));

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


                if (this._userSearchAccessor.searchType == 'advanced')
                   {
                   var conTemp = this._userProfileAccessor.profileName
                   conTemp = conTemp.replace('s','')
                   var posnLast = Object.keys(answer.context.prompts[0]).length
                   answer.context.prompts[posnLast - 1] = {displayOrder:1,qna:null,displayText:'Stop search [' + conTemp +']'};
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
            
            return await stepContext.next();
            }
}

async changeContract(stepContext, userState) { 

       //console.log("\n\n817 ..........SAVE..............");

       var currentQuery = stepContext._info.values.currentQuery;
       var currentPosn = currentQuery.indexOf(':',0);    
       var currentContract = currentQuery.substring(0, currentPosn); 

       //console.log("\n842 currentQuery  = " + currentQuery);
       //console.log("\n843 currentContract  = " + currentContract + "\n");
       //console.log("\n844 ProfileAccessor.profileName = " + this._userProfileAccessor.profileName);
       //console.log("\n845 userSearchAccessor.searchType = " + this._userSearchAccessor.searchType);

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

