const moment = require('moment');

const informationIntentNames = [
    'me.information',
    'me.information:age'
];

const getInformation = function(source,queryResult){
    let text = queryResult.fulfillmentText;
    text = text.replace('[bot-name]', process.env.BOOT_NAME);

    let ageTxt= '',
        birthDate = moment(new Date(process.env.BOOT_BIRTH)), currentDate = moment(),
        duration = moment.duration(currentDate.diff(birthDate));

    if( duration.days() > 0 ){
        ageTxt += duration.days()+ ' ngày';
    }
    if( duration.hours() > 0 ){
        ageTxt += " "+ duration.hours()+ ' giờ';

        if( duration.days() < 10 && duration.minutes() > 1 ){
            ageTxt += " "+ duration.minutes()+ ' phút';
        }
    }

    text = text.replace('[age]', ageTxt);
    return text;
};

module.exports = {intents:informationIntentNames,responses:getInformation};