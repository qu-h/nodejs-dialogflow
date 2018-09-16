'use strict';

const weatherIntents = [
    'weather',
    'weather - context:weather - comment:activity',
    'weather - context:weather - comment:address',
    'weather - context:weather - comment:address & date-time',
    'weather - context:weather - comment:condition',
    'weather - context:weather - comment:date time',
    'weather - context:weather - comment:outfit',
    'weather.activity',
    'weather.condition',
    'weather.outfit',
    'weather.temperature',
];

const weatherActivityIntents = [
    'weather - context:weather - comment:activity',
    'weather.activity',
];

const weatherActivityHandlers = {
    'cycling': (skycode, temperature) => {
        return (temperature > 5) &&
        ([27, 28, 29, 30, 31, 32, 33, 34, 36].includes(skycode)) ? 1 : 0;
    },
    'run': (skycode, temperature) => {
        return (temperature > 0) &&
        ([27, 28, 29, 30, 31, 32, 33, 34, 36].includes(skycode)) ? 1 : 0;
    },
    'skiing': (skycode, temperature) => {
        return (temperature < 0) &&
        ([5, 13, 14, 15, 16, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 36, 41, 42, 43,
        ].includes(skycode)) ? 1 : 0;
    },
    'hiking': (skycode, temperature) => {
        return (temperature < 0) &&
        ([27, 28, 29, 30, 31, 32, 33, 34, 36].includes(skycode)) ? 1 : 0;
    },
    'sightseeing': (skycode, temperature) => {
        return ([26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 39, 41]
            .includes(skycode)) ? 1 : 0;
    },
    'default': (skycode, temperature) => {
        return -1;
    },
};

const weatherJS = require('weather-js');
const weatherGet = (queryResult) => {
    let addressStr = 'Hanoi', unitStr= 'C', parameters = queryResult.parameters;

    if( parameters.fields ){
        let pAddress = parameters.fields['address'],
            pUnit = parameters.fields['unit'];

        if (!!pAddress.structValue) {

            addressStr = pAddress.structValue.fields.city.stringValue;

        } else if (!!pAddress.stringValue) {

            addressStr = pAddress.stringValue;
        }
        unitStr = pUnit.stringValue;
    } else if (queryResult.parameters.address) {
        addressStr  = queryResult.parameters.address;
        unitStr     = queryResult.parameters.unit;
    }

    console.log('begin check weather addressStr:%s | unitStr:%s',addressStr,unitStr);
    return new Promise(function(resolve, reject) {
        weatherJS.find({ search: addressStr, degreeType: unitStr, },
            function(err, weatherResult) {
                if (err) {
                    return reject(err);
                }

                if (weatherResult.length <= 0) {
                    return reject("ERROR: No data found");
                }

                let text = queryResult.fulfillmentText,
                    weather = weatherResult[0].current;

                text = text.replace('[status]', weather.skytext);
                text = text.replace('[address]', addressStr);
                text = text.replace('[temperature]', weather.temperature);
                text = text.replace('[unit]', unitStr);

                if (weatherActivityIntents.includes(queryResult.intent.displayName)) {
                    let pActivity = queryResult.parameters.fields['activity'];
                    let activityStr = !!pActivity ? pActivity.stringValue : '';

                    let handler = weatherActivityHandlers[activityStr] ||
                        weatherActivityHandlers['default'];
                    let canDoActivity = handler(Number(weather.skycode), Number(weather.temperature));

                    if (canDoActivity === 1) {
                        text = 'I think yes! ' + text;
                    } else if (canDoActivity === 0) {
                        text = 'I think no! ' + text;
                    }
                }
                return resolve(text);
            }
        );

    });
};

module.exports = {weatherIntents,weatherGet};