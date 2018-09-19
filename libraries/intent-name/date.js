const moment = require('moment');
const {getLunar} = require('../calendar/lunar-ict');

const getDate = function(source,queryResult){
    let text = queryResult.fulfillmentText,
        parameters = '',
        date = '',
        dateCurrent = moment(),
        dateType = '',
        dateStr = ''
    ;

    if( ['facebook'].includes(source) ){
        parameters = queryResult.parameters;
        date = parameters['date'];
        dateType = parameters['date-type'];
    } else {
        parameters = queryResult.parameters.fields;
        if( typeof parameters['date'] !== 'undefined' ){
            date = parameters['date'].stringValue;
        }
        if( typeof parameters['date-type'] !== 'undefined'){
            dateType = parameters['date-type'].stringValue
        }
    }


    if( date.length < 0 ){
        date = 'today';
    }


    if( dateType === 'lunar' ){
        let lunarDate = getLunar(dateCurrent);
        dateStr = lunarDate.dayFullname;

    } else {
        dateStr = dateCurrent.format('DD/MM/YYYY');
    }

    if( typeof text === 'undefined'){
        text = 'hôm nay là ngày [date-string]';
    }

    text = text.replace('[date-string]', dateStr);

    return new Promise(function(resolve) {
        resolve(text);
    });

};


const intentNames = [
    'date.get'
];

module.exports = {intents:intentNames,responses: getDate};