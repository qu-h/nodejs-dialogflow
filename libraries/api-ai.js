const fs = require('fs');
const requestHttp = require('request');


class dialogflow_ai {
	constructor(responses,request) {
        this.promise = null;
        this.source = 'prompt';
        this.message = '';

	    if( typeof responses ==='object' && responses.constructor.name === 'ServerResponse'){
            let result = request.body;
            this.queryResult = request.body.result;
            this.source = request.body.originalRequest.source;
            let context = result.result.contexts;
            this.intentName = this.queryResult.metadata.intentName;
        } else {
            if( responses && responses.length > 0) {
                let result = responses[0].queryResult;
                this.queryResult = result;
                this.intentName = result.intent.displayName;
            }
        }

        //console.log("responses.constructor.name : %s | source : ",responses.constructor.name,this.source);
        //console.log("queryResult : ",this.queryResult);
        //console.log("fulfillment : ",this.queryResult.fulfillment.speech);

        console.log("source : %s | intentName : %s", this.source, this.intentName);

        switch(this.source) {
            case 'facebook':
                //this.facebookSendTypingOn();
                if( typeof this.queryResult.fulfillmentText !== 'undefined' ){
                    this.message = this.queryResult.fulfillmentText;
                } else if (
                    typeof this.queryResult.fulfillment !== 'undefined' 
                    && typeof this.queryResult.fulfillment.speech !== 'undefined'
                ) {
                    this.message = this.queryResult.fulfillment.speech;
                }
                break;
            default:
                break;
        }
        //console.log('debug this.message :',this.message);
        this.intentObject();
	}

	intentObject(){
        const {informationIntentNames,getInformation} = require('./infomation/me');
        let queryResult = this.queryResult;

        let intentPhase = this.intentName.split('.');
        //console.log('intentName: %s : intentPhase : %s',this.intentName,intentPhase);

        if( fs.existsSync(__dirname+'/intent-name/'+this.intentName+'.js') ) {
            const {intents,responses} = require('./intent-name/'+this.intentName);
            if (intents.includes(this.intentName)) {
                this.promise = responses(this.source,this.queryResult);
            }
        } else if( fs.existsSync(__dirname+'/intent-name/'+intentPhase[0]+'.js') ){
            const {intents,responses} = require('./intent-name/'+intentPhase[0]);
            if (intents.includes(this.intentName)) {
                this.promise = responses(this.source,this.queryResult);
            }
        } else {
            this.message = queryResult.fulfillmentText;

        }
	}

	get promiseGet(){
        if( this.promise === null ) {
            let message = this.message;
            return new Promise(function (resolve) {
                resolve(message);
            });
        } else if ( typeof this.promise === 'string'){
            let textReturn = this.promise;
            return new Promise(function (resolve) {
                resolve(textReturn);
            });
		} else {
            return this.promise;
        }
	}

    facebookSendTypingOn(){
        let messageData = {
            recipient: { id: null },
            sender_action: "typing_on"
        };
        this.facebookSendMessage(messageData);
    }

    facebookSendTypingOff(){
        let messageData = {
            recipient: { id: null },
            sender_action: "typing_off"
        };
        this.facebookSendMessage(messageData);
    }

    facebookSendMessage(messageData){
        let recipient_id;
        if( this.queryResult.contexts.length > 0 ){
            let queryContexts = this.queryResult.contexts ,
            outputContext = queryContexts.filter(context => (typeof context.parameters.facebook_sender_id !== 'undefined' && context.parameters.facebook_sender_id.length > 0));
            recipient_id = outputContext[0].parameters.facebook_sender_id;
        }
        messageData.recipient.id = recipient_id;

        requestHttp({
            url: 'https://graph.facebook.com/v3.0/me/messages',
            qs: {access_token: process.env.FACEBOOK_ACCESS_TOKEN},
            method: 'POST',
            json: messageData
        }, function (error, response) {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        }); 
    }

}

module.exports = {chatBot:dialogflow_ai};