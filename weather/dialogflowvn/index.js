'use strict';

// Bạn cần thực hiện các bước sau đây để lấy file chứng thực theo hướng dẫn từ
// https://developers.google.com/identity/protocols/application-default-credentials
//
// 1: Vào url https://console.developers.google.com/project/_/apis/credentials
// 2: Từ drop-down các dự án, chọn dự án của Weather
// 3: Trên trang Credentials, chọn Create credentials, chọn Service account key
// 4: Từ Service account drop-down, chọn Dialogflow Integrations
// 5: Mục Key type, chọn JSON, nhấn nút Create để download file chứng thực
process.env.GOOGLE_APPLICATION_CREDENTIALS = './GiaiphapIct-9971abe15a37.json';

const weatherjs = require('weather-js');
const readline = require('readline');

// Bạn có thể lấy thông tin project ID trong phần setting của Dialogflow agent
// https://dialogflow.com/docs/agents#settings
const projectId = 'giaiphapict-191216';

const sessionId = 'weather-pro-prebuilt-agent-session-id';

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'User> ',
});

rl.prompt();

rl.on('line', (line) => {
    let userSay = line.trim();

    if (userSay.length <= 0) {
        rl.prompt();
        return;
    }

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userSay,
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then((responses) => {
            const result = responses[0].queryResult;

            if (weatherIntents.includes(result.intent.displayName)) {
                const pAddress = result.parameters.fields['address'];
                const pUnit = result.parameters.fields['unit'];

                let addressStr = 'Hanoi';
                if (!!pAddress.structValue) {
                    addressStr = pAddress.structValue.fields.city.stringValue;
                } else if (!!pAddress.stringValue) {
                    addressStr = pAddress.stringValue;
                }

                let unitStr = pUnit.stringValue;

                weatherjs.find({
                        search: addressStr,
                        degreeType: unitStr,
                    },
                    function(err, weatherResult) {
                        if (err) {
                            console.error('Bot > ERROR: ', err);
                            rl.prompt();
                            return false;
                        }

                        if (weatherResult.length <= 0) {
                            console.log('Bot > No data found');
                            rl.prompt();
                            return false;
                        }

                        let text = responses[0].queryResult.fulfillmentText;

                        let weather = weatherResult[0].current;

                        text = text.replace('[status]', weather.skytext);
                        text = text.replace('[address]', addressStr);
                        text = text.replace('[temperature]', weather.temperature);
                        text = text.replace('[unit]', unitStr);

                        if (weatherActivityIntents.includes(result.intent.displayName)) {
                            let pActivity = result.parameters.fields['activity'];
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

                        console.log('Bot > ' + text);
                        rl.prompt();
                    }
                );
            } else {
                console.log('Bot > ' + result.fulfillmentText);
                rl.prompt();
            }
        })
        .catch((err) => {
            console.error('ERROR:', err);
        });
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});
