const fs = require('fs');

class dialogflow_ai {
	constructor(responses,request) {
        this.promise = null;
        this.source = 'prompt';
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
        this.intentObject();
	}

	intentObject(){
        const {informationIntentNames,getInformation} = require('./infomation/me');
        //console.log('instant name: %s',this.intentName);

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
        }
	}

	get promiseGet(){
        if( this.promise === null ) {
            let result = this.queryResult;
            return new Promise(function (resolve) {
                resolve(result.fulfillmentText);
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
}

module.exports = {chatBot:dialogflow_ai};