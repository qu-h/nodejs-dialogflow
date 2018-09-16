const moment = require('moment');

const informationIntentNames = [
    'LunarCalendar'
];

const getDate = function(queryResult){
    let text = queryResult.fulfillmentText,
        dateTxt= '', currentDate = moment();


    text = text.replace('[lunar-date]', dateTxt);
    return text;
};

module.exports = {informationIntentNames,getInformation};