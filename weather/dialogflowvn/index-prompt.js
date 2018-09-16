'use strict';

// Bạn cần thực hiện các bước sau đây để lấy file chứng thực theo hướng dẫn từ
// https://developers.google.com/identity/protocols/application-default-credentials
//
// 1: Vào url https://console.developers.google.com/project/_/apis/credentials
// 2: Từ drop-down các dự án, chọn dự án của Weather
// 3: Trên trang Credentials, chọn Create credentials, chọn Service account key
// 4: Từ Service account drop-down, chọn Dialogflow Integrations
// 5: Mục Key type, chọn JSON, nhấn nút Create để download file chứng thực

const result = require('dotenv').config();
if (result.error) {
    throw result.error;
}

const weatherjs = require('weather-js');
const {weatherIntents,weatherGet,aiInformationIntents,getInformation} = require('./dialogflow-intent');

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(process.env.APIAI_PROJECT_ID, process.env.APIAI_SESSION_ID);


const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'User : ',
});

const botAnswer = function(txt){
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
            const result = responses[0].queryResult, intentName = result.intent.displayName;
            let msg="";
            
            if (weatherIntents.includes(intentName)) {
                let weatherPromise = weatherGet(result,result.parameters);
                weatherPromise.then(function (msg) {
                    botAnswer(msg);
                }).catch(function () {
                    botAnswer('Have error!');
                });
            } else if ( aiInformationIntents.includes(intentName) ){
                msg = getInformation(responses,process.env);
                botAnswer(msg);
            } else {
                msg = result.fulfillmentText;
                botAnswer(msg);
            }
        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});
