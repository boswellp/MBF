<h3>FIDICchatbot - MBF version of FIDICbot for Skype</h3>

This MBF version of the FIDICbot chatbot (called FIDICchatbot to distinguish it from FIDICbot, the Smooch version) is for accessing FIDIC works contracts and services agreements. 

<h4>1. Historic</h4>

FIDICchatbot was originally based on the <a href="https://blogs.msdn.microsoft.com/sarahsays/2016/">SarahSays</a> Microsoft Bot Framework "Hello World" and was deployed to Heroku with Node, as described <a href="https://github.com/boswellp/BotFramework">here</a>.

FIDICchatbot was then deployed to Azure and was available as a web app on Azure on and <a href="http://www.fidic.tips/fidicbot">FIDIC.tips</a> and on Skype. This first MBF version of FIDICchatbot was terminated in 2018 because maintenance was excessive in view of the limited messenging channels available at the time.

There was also a Twitter Direct Messages version of FIDICbot based on the <a href="https://github.com/twitterdev/twitter-webhook-boilerplate-node">Twitter Webhook Boilerplate Node</a>, a node.js framework. It was deployed to Heroku but did not use Smooch for integration. The Github source was made available publically. It was @FIDICbot at <a href="https://twitter.com/fidicbot/">twitter.com/fidicbot</a>, with a logon necessary to access.

<h4>2.FIDICbot</h4>

FIDICbot remains deployed to Heroku with multichannel integration by Smooch for Messenger, Telegram, LINE, and Viber. The web version of FIDICbot is at <a href="http://fidic.pw">fidic.pw</a> with support provided as part of the <a href="http://fidic.tips/">FIDIC.tips</a> service.

WeChat integration has proved dificult to maintain. SMS (via Twilio) is expensive and has been temporarily stopped. Details are available at <a href="http://fidic.tips/bot">FIDIC.tips/bot</a>

<h4>3.FIDICchatbot</h4>

With Smooch becoming more commercially minded following its takeover by Sunrise, there has been a worry that FIDICbot with its 500 free messages per month will become too expensive.

It was therefore decided in early-2020 to relaunch FIDICchatbot using MBF, especially since this would enable Skype to be served as well as WhatsApp via Twilio (although this has not been activated owing to cost considerations during development).

In developing FIDICchatbot using MBF version 4, the aim is to maintain all the features offered by FIDICbot, especially advanced searching of the FIDIC contracts and guides.

The FIDIC contracts are being uploaded progessively (to QnAMaker) while debugging and development continues. 

Further details of the implementation will be made available.

<h4>5.FIDICchatbot development</h4>

Our aim is to have a single app that serves as manay channels as possible. The main difficulties arise with Messenger that only allows for a very short message if prompts are added to the message. The solution is to have the message and its prompts in separate messages.

The Bot Framework multiturn QnA Maker <a href="https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/70.qnamaker-multiturn-sample">sample bot</a> provided the basis for FIDICchatbot. The current code needs cleaning up as the focus up to now has been to set up the necessary feautures.

The various FIDIC contracts are stored in separate QnAMaker knowledgebases. These use the same coding scheme as for FIDICbot's JSON source files. LUIS messenging and a MongoDB database are available but we prefer to keep all the FIDIC contracts and related information in the knowledgebases so information can be uploaded quickly via Excel spreadsheets.

We find that with appropriate control of QnAMaker dialog settings, full searching of the FIDIC contracts is available. The results of these full searches are separated into standard categories using meta tags that tag FIDIC contract clauses according to standard categories. The DnAMaker knowledgebases also allow the index of each contract to be search. 

To switch between knowledgebases, because we are using multiturn we don't think that we can use <a href="https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-tutorial-dispatch?view=azure-bot-service-4.0&tabs=js">dispatch</a> with LUIS (see <a href="https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/14.nlp-with-dispatch"> sample</a> ). There is no problem getting dispatch to work with several knowledgbases and one LUIS app. However, multiturn needs the current and previous QnAMaker IDs to be available. These we can identify manually or by forcing knowledgebases to be loaded and the IDs are then stored. At least two IDs are needed for each knowledgebase (we store the IDs for "select" and for the name of the knowledgbase's contract).

To switch between knowledgebases, because we are using multiturn we don't think that we can use <a href="https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-tutorial-dispatch?view=azure-bot-service-4.0&tabs=js">dispatch</a> with LUIS (see <a href="https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/14.nlp-with-dispatch">sample</a>). There is no problem getting dispatch to work with several knowledgbases and one LUIS app. However, multiturn needs the current and previous QnAMaker IDs to be available. These we can identify manually or by forcing knowledgebases to be loaded and the IDs are then stored. At least two IDs are needed for each knowledgebase (we store the IDs for "select" and for the name of the knowledgbase's contract).

FIDIChatbot, like FIDICbot, runs on Node on Heroku with files stored on Github. FIDICchatbot's BotFramework channels on <a href="https://portal.azure.com">Azure</a> are WebChat, Skype, Messenger, and Telegram. LINE is  not useable and WhatsApp via Twilio works in a sandbox. The public release of Messenger is pending.

Updated April 2020

