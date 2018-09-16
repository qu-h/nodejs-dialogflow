
'use strict';

// Bạn cần thực hiện các bước sau đây để lấy file chứng thực theo hướng dẫn từ
// https://developers.google.com/identity/protocols/application-default-credentials
//
// 1: Vào url https://console.developers.google.com/project/_/apis/credentials
// 2: Từ drop-down các dự án, chọn dự án của Weather
// 3: Trên trang Credentials, chọn Create credentials, chọn Service account key
// 4: Từ Service account drop-down, chọn Dialogflow Integrations
// 5: Mục Key type, chọn JSON, nhấn nút Create để download file chứng thực
//process.env.GOOGLE_APPLICATION_CREDENTIALS = './GiaiphapIct-9971abe15a37.json';

const express = require('express');
const bodyParser = require('body-parser');
const result = require('dotenv').config();
if (result.error) {
    throw result.error;
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    console.log('setting env API_AI_TOKEN : %s',process.env.API_AI_TOKEN);

});


// Bạn có thể lấy thông tin project ID trong phần setting của Dialogflow agent
// https://dialogflow.com/docs/agents#settings
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();
//const sessionPath = sessionClient.sessionPath(process.env.APIAI_PROJECT_ID, process.env.APIAI_SESSION_ID);

const requestHttp = require('request');
const sendTextMessage = (senderId, text) => {
    console.log('process.env.FACEBOOK_ACCESS_TOKEN : %s | senderID',process.env.FACEBOOK_ACCESS_TOKEN,senderId);
    requestHttp({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: senderId},
            message: {text},
        }
    });
};

const botAnswer = (queryResult,txt)=>{
    let senderId;
    if( queryResult.outputContexts.length > 0 ){
    	let outputContext = queryResult.outputContexts.filter(context => (typeof context.parameters.facebook_sender_id !== 'undefined' && context.parameters.facebook_sender_id.length > 0));
        senderId = outputContext[0].parameters.facebook_sender_id;
    }
    if( senderId ){
        sendTextMessage(senderId, txt);
    } else {
        console.log('no data action',queryResult.outputContexts)
    }

};

const {weatherIntents,weatherGet,aiInformationIntents,getInformation} = require('./dialogflow-intent');

app.post('/api-ai', function(req, responses) {
    let dialogFlowAction = req.body.queryResult.action;
    const queryResult = req.body.queryResult,
        intentName = queryResult.intent.displayName;
    let msg = '';

    // console.log('bug intentName:%s ',intentName,{queryResult});
    if (weatherIntents.includes(intentName)) {

        let weatherPromise = weatherGet(queryResult,queryResult.parameters);
        weatherPromise.then(function (msg) {
            botAnswer(queryResult,msg);
        }).catch(function () {
            botAnswer(queryResult,'Have error!');
        });
    } else if ( aiInformationIntents.includes(intentName) ){
        msg = getInformation(queryResult,process.env);
        botAnswer(queryResult,msg);
        // if( queryResult.outputContexts && queryResult.outputContexts.length > 0 ){
        //     let senderId = queryResult.outputContexts[0].parameters.facebook_sender_id;
        //     sendTextMessage(senderId, msg);
        // } else {
        //     console.log('97 have error');
        // }
        //req.status(200).end();
    } else {
        msg = queryResult.fulfillmentText;
        botAnswer(queryResult,msg);
        req.status(200).end();
    }

});

