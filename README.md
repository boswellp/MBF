<h3>FIDICchatbot - MBF version of FIDICbot for Skype</h3>

This MBF version of the FIDICbot chatbot (called FIDICchatbot to distinguish it from FIDICbot, the Smooch version) is for accessing FIDIC works contracts and services agreements. 

<h4>1. Historic</h4>

FIDICchatbot was originally based on the <a href="https://blogs.msdn.microsoft.com/sarahsays/2016/">SarahSays</a> Microsoft Bot Framework "Hello World" and was deployed to Heroku with Node, as described <a href="https://github.com/boswellp/BotFramework">here</a>.

FIDICchatbot was then deployed to Azure and was available as a web app on Azure on and <a href="http://www.fidic.tips/fidicbot">FIDIC.tips</a> and on Skype. This first MBF version of FIDICchatbot was terminated in 2018 because maintanance was excessive in view of the limited messenging channels available at the time.

There was also a Twitter Direct Messages version of FIDICbot based on the <a href="https://github.com/twitterdev/twitter-webhook-boilerplate-node">Twitter Webhook Boilerplate Node</a>, a node.js framework. It was deployed to Heroku but does not use Smooch for integration. The Github source was made available publically. It was @FIDICbot at <a href="https://twitter.com/fidicbot/">twitter.com/fidicbot</a>, with a logon necessary to access.

<h4>2.FIDICbot</h4>

FIDICbot remains deployed to Heroku with multichannel integration by Smooch for Messenger, Telegram, LINE, and Viber. The web version of FIDICbot is at <a href="http://fidic.pw">fidic.pw</a> with support provided as part of the <a href="http://fidic.tips/">FIDIC.tips</a> service.

WeChat integration has proved dificult to maintain. SMS (via Twilio) is expensive and has been temporarily stopped. Details are available at <a href="http://fidic.tips/bot">FIDIC.tips/bot</a>

<h4>3.FIDICchatbot</h4>

With Smooch becoming more commercially minded following its takeover by Sunrise, there has been a worry that FIDICbot with its 500 free messages per month will become too expensive.

It was therefore decided in early-2020 to relaunch FIDICchatbot using MBF, especially since this would enable Skype to be served as well as WhatsApp via Twilio (although this has not been activated owing to cost considerations during development).

In developing FIDICchatbot using MBF version 4, the aim is to maintain all the features offered by FIDICbot, especially advanced searching of the FIDIC contracts and guides.

The FIDIC contracts are being upladed progessively while debugging and development continues.

<emphasis>Updated March 2020</emphasis>

