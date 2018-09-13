
'use strict';

// Bạn cần thực hiện các bước sau đây để lấy file chứng thực theo hướng dẫn từ
// https://developers.google.com/identity/protocols/application-default-credentials
//
// 1: Vào url https://console.developers.google.com/project/_/apis/credentials
// 2: Từ drop-down các dự án, chọn dự án của Weather
// 3: Trên trang Credentials, chọn Create credentials, chọn Service account key
// 4: Từ Service account drop-down, chọn Dialogflow Integrations
// 5: Mục Key type, chọn JSON, nhấn nút Create để download file chứng thực
//process.env.GOOGLE_APPLICATION_CREDENTIALS = './GiaiphapIct-9971abe15a37.json';

const express = require('express');
const bodyParser = require('body-parser');
const result = require('dotenv').config();
if (result.error) {
    throw result.error;
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    console.log('setting env API_AI_TOKEN : %s',process.env.API_AI_TOKEN);

});


// Bạn có thể lấy thông tin project ID trong phần setting của Dialogflow agent
// https://dialogflow.com/docs/agents#settings
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(process.env.APIAI_PROJECT_ID, process.env.APIAI_SESSION_ID);

