'use strict';

//Initialize libraries
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const {
  SimpleResponse,
  BasicCard,
  Image,
  Suggestions,
  Button
} = require('actions-on-google');
// Instantiate a datastore client
const datastore = Datastore();
const app = dialogflow({debug: true});
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');

app.middleware((conv) => {
    
});

//Setup contexts
const Contexts = {
    ONE_MORE: 'one_more'
};
app.intent('quit_app', (conv) => {
    conv.close("Have a good day! come back again. Bye!");
});
app.intent('start_app', (conv) => {
    conv.contexts.set(Contexts.ONE_MORE,5);
    const initMessage = ` Welcome to LitInspire. With great quotes and inspiring passages, I will inspire you.`;
    return  getQuote().then((entity)=>{
         return getMessageFromQuote(entity,initMessage,conv);
    });
      
});
app.intent('one_more_yes', (conv) => {
    conv.contexts.set(Contexts.ONE_MORE,3);
    const initMessage = `Great! Here is another one with conv.ask .`;
    conv.ask(initMessage);

    // return  getQuote().then((entity)=>{
    //     console.log('===================intent one_more_yes =========================',entity);
    //     return getMessageFromQuote(entity,initMessage,conv);
    // });
});
app.intent('one_more_no', (conv) => {
    conv.close("Hope you're inspired and ready to take on your challenges. Have a good day and come back for more.");
});
app.intent('Default Fallback Intent', (conv) => {
    console.log(conv.data.fallbackCount);
    if (typeof conv.data.fallbackCount !== 'number') {
      conv.data.fallbackCount = 0;
    }
    conv.data.fallbackCount++;
    // Provide two prompts before ending game
    if (conv.data.fallbackCount === 1) {
      conv.contexts.set(Contexts.ONE_MORE,2);
      return conv.ask(new Suggestions('Yes Please', 'No thanks'), new SimpleResponse("Would you like to hear a quote?"));
    }else if(conv.data.fallbackCount === 2){
      return conv.ask(new Suggestions('Yes Please', 'No thanks'), new SimpleResponse("Welcome to LitInspire. With great quotes and inspiring passages, I will inspire you.Would you like to hear a quote?"));
    }
   return conv.close("This isn't working.Have a good day. Bye! ");
});

function getRandomNumber(){
    let num_quotes = 2;
    return  Math.floor((Math.random()*num_quotes)+1);
}

function buildReadableQuoteFromEntity(entity){
    if( typeof entity !== 'undefined'){
        let readableQuote =  entity.quote +
            `<break time="1s"/> This was said by ` + entity.author + ` `  ;
        if(entity.comments){
            readableQuote +=  entity.comments + ` `;
        }
        return readableQuote;
    } else {
        console.log('===================buildReadableQuoteFromEntity=========================');
        return '';
    }

}
function getViewableQuote(entity){
    if( typeof entity !== 'undefined'){
        let viewableQuote =  entity.quote +
            `.This was said by ` + entity.author + ` `  ;
        if(entity.comments){
            viewableQuote +=  entity.comments + ` `;
        }
        return viewableQuote;
    } else {
        console.log('===================getViewableQuote=========================');
        console.log('getViewableQuote got error ');
        return '';
    }

}
function getEndingMessage(){
return `  <audio src="https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg" clipBegin="10s" clipEnd="13s">Consider the quote!</audio>
     Do you want to listen to another quote?`;
}
function getEndingMessageText(){
  return `.Do you want to listen to another quote?`;
  }
function getMessageFromQuote(entity,initMessage,conv){
    return conv.ask(new Suggestions('Yes Please', 'No thanks'), new SimpleResponse(initMessage),
    new SimpleResponse( {text: getViewableQuote(entity) + getEndingMessageText(),
        speech: `<speak> ` +  buildReadableQuoteFromEntity(entity)   + getEndingMessage() + ` </speak>  ` }));
}

function getQuote(){
    return new Promise(((resolve,reject) => {
        let randomQuoteNum = getRandomNumber();
        console.log("the id of the quote is: quote_"+randomQuoteNum);
        const key = datastore.key(['quote', 'quote_'+randomQuoteNum]);
        console.log("Querying datastore for the quote..."+key);
        let readableQuote = '';

        datastore.get(key,(err,entity) => {
            if(!err){
                console.log('entity:'+entity);
                resolve(entity);
            }else{
                reject(console.log('Error occured'));
            }
        });
  }));
}
// HTTP Cloud Function for Firebase handler
exports.InspireMe = functions.https.onRequest(app);



exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    // typeof response = 'IncomingMessage'
    console.log('===================dialogflowFirebaseFulfillment request =========================',request);
    console.log('===================dialogflowFirebaseFulfillment response =========================',response);

    const agent = new WebhookClient({ response, request });


    function intentHandler(agent) {
        agent.add('This message is from Dialogflow\'s Cloud Functions for Firebase editor!');
        // agent.add(new Card({
        //         title: 'Title: this is a card title',
        //         imageUrl: 'https://developers.google.com/actions/assistant.png',
        //         text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
        //         buttonText: 'This is a button',
        //         buttonUrl: 'https://assistant.google.com/'
        //     })
        // );
        // agent.add(new Suggestion('Quick Reply'));
        // agent.add(new Suggestion('Suggestion'));
    }

    agent.handleRequest(intentHandler);
});