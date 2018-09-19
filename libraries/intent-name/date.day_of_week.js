const moment = require('moment');
const {getLunar} = require('../calendar/lunar-ict');

const getDate = function(source,queryResult){

    let text = queryResult.fulfillmentText,
        parameters , date = '',
        dateCurrent = moment(),
        dateType = '', weekDayName = '';


    if( ['facebook'].includes(source) ){
        parameters = queryResult.parameters;
        date = parameters.date;
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

    weekDayName = dateCurrent.format('dddd');


    if( typeof text === 'undefined' || text.length < 2 ){
        text = 'hôm nay là [day-name]';
    }

    let vietnamese = {
        Monday  :'thứ hai',
        Tuesday:'thứ ba',
        Wednesday: 'thứ tư',
        Thursday:'thứ năm',
        Friday:'thứ sáu',
        Saturday:'thứ bẩy',
        Sunday:'chủ nhật'
    };

    text = text.replace('[day-name]', vietnamese[weekDayName]);
    return new Promise(function(resolve) {
        resolve(text);
    });

};


const intentNames = [
    'date.day_of_week'
];

module.exports = {intents:intentNames,responses: getDate};