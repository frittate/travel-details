var http = require('http');
var fs = require('fs');
const WEBSERVICE_URL = 'http://gagnaveita.vegagerdin.is/api/faerd2017_1';
const OUTPUT_JSON_FILE = 'filteredTrafficDetails.json';
const requiredIDs = [910370012, 910410012, 910420012];
const LOG_MESSAGES = {
    WebService: {
        started: 'Webservice reading started...',
        succeeded: 'Webservice read succeeded!',
        failed: 'Webservice read failed'
    },
    Filter: {
        started: 'Data filtering started...',
        succeeded: 'Data filtering succedded!'
    },
    Save: {
        started: 'Saving JSON file started...',
        succeeded: 'Process completed successfully!'
    }
};

init = () => {
    console.log(LOG_MESSAGES.WebService.started);

    http.get(WEBSERVICE_URL, function (response) {
        let data = '';

        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            console.log(LOG_MESSAGES.WebService.succeeded);
            filterResponse(JSON.parse(data));
        });
    }).on('error', (error) => {
        console.error(LOG_MESSAGES.WebService.started, error);
    });;
}

filterResponse = (data) => {
    console.log(LOG_MESSAGES.Filter.started);
    const filteredData = data.filter(item => requiredIDs.includes(item.IdButur));
    console.log(LOG_MESSAGES.Filter.succeeded);
    saveJsonFile(filteredData);
}

saveJsonFile = (filteredData) => {
    console.log(LOG_MESSAGES.Save.started);
    fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(filteredData), { encoding: 'utf8', flag: 'w' });
    console.log(LOG_MESSAGES.Save.succeeded);
}

init();