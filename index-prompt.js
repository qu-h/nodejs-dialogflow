'use strict';

const result = require('dotenv').config();
if (result.error) {
    throw result.error;
}

//const weatherjs = require('weather-js');
//const {weatherIntents,weatherGet,aiInformationIntents,getInformation} = require('./dialogflow-intent');

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(process.env.APIAI_PROJECT_ID, process.env.APIAI_SESSION_ID);

const {chatBot} = require('./libraries/api-ai');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'User : ',
});

const botAnswer = (txt)=>{
    if( typeof txt === 'string'){
        console.log('Bot  : ' + txt);
    } else {
        console.log('error',{txt} );
    }
    rl.prompt();
};

rl.prompt();
rl.on('line', (line) => {
    let userSay = line.trim();

    if (userSay.length <= 0) {
        rl.prompt();
        return;
    }

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userSay,
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then((responses) => {
            let ai = new chatBot(responses,request), AI_promise = ai.promiseGet;
            if( typeof AI_promise === 'undefined'){
                botAnswer('Have error!',AI_promise);
            } else {
                AI_promise.then(function (msg) {
                    botAnswer(msg);
                }).catch(function (e) {
                    botAnswer('Have error!');
                });
            }

        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});
