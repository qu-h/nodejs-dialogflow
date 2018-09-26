
'use strict';

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


const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

const requestHttp = require('request');
const sendTextMessage = (senderId, text) => {
    if( text && senderId ){
        requestHttp({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: process.env.FACEBOOK_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: senderId},
                message: {text},
            }
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });    
    } else {
        console.log('have error senderID : %s | send message : %s',senderId,text);
    }
    
};

const botAnswer = (queryContexts,txt)=>{
    let senderId;
    if( queryContexts.length > 0 ){
    	let outputContext = queryContexts.filter(context => (typeof context.parameters.facebook_sender_id !== 'undefined' && context.parameters.facebook_sender_id.length > 0));
        senderId = outputContext[0].parameters.facebook_sender_id;
    }
    if( senderId ){
        sendTextMessage(senderId, txt);
    } else {
        console.log('no data action',queryResult.outputContexts)
    }

};

const {chatBot} = require('./libraries/api-ai');
app.post('/api-ai', function(req, responses) {
    //console.log('begin call api-ai');
    let ai = new chatBot(responses,req), AI_promise = ai.promiseGet;
    const queryContexts = req.body.result.contexts;
    if( typeof AI_promise === 'undefined'){
        botAnswer(queryContexts,'Have error!');
    } else {
        AI_promise.then(function (msg) {
            botAnswer(queryContexts,msg);
        }).catch(function (e) {
            botAnswer(queryContexts,'Have error! %s',e);
        });
    }
});

