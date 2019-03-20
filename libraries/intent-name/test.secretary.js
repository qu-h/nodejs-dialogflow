const informationIntentNames = [
    'test.secretary'
];

const getInformation = function(source,queryResult){
    let text = queryResult.fulfillmentText;
    return text;
};

module.exports = {intents:informationIntentNames,responses:getInformation};