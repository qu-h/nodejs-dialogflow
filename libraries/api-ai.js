
class dialogflow_ai {
	constructor(responses,request) {
		if( responses && responses.length > 0) {
            let result = responses[0].queryResult;

            this.queryResult = result;
			this.intentName = result.intent.displayName;
            this.promise = null;
			this.intentObject();
		}
	}

	intentObject(){
        const {informationIntentNames,getInformation} = require('./infomation/me');
        console.log('instant name: %s',this.intentName);
        if ( informationIntentNames.includes(this.intentName) ){
            this.promise = getInformation(responses,process.env);
            console.log('bug line 18',this.promise);
        }

        if( !this.promise ){
            const {weatherIntents,weatherGet} = require('./weather/dialogflowvn');
            if (weatherIntents.includes(this.intentName)) {
                this.promise = weatherGet(this.queryResult);
            }
		}

        if( !this.promise ){
            const {weatherIntents,weatherGet} = require('./weather/dialogflowvn');
            if (weatherIntents.includes(this.intentName)) {
                this.promise = weatherGet(this.queryResult);
            }
        }
	}

	get promiseGet(){
        if( this.promise === null ){
        	let result = this.queryResult;
            return new Promise(function(resolve) {
				resolve(result.fulfillmentText);
			});
		}
	}
}

module.exports = {chatBot:dialogflow_ai};