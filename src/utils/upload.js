const got = require('got');
const fs = require('fs');
const FormData = require('form-data');
const path = require("path");

// method used to upload a file to Openload Servers
module.exports = async (url, filePath, params) => {

    // get sha1 of file
    params.sha1 = await sha1(filePath);

    // make request to get the Upload Agent's URL
    let response = await got(url, {
        method : 'GET',
        json   :  true,
        query  : params,
    });

    // check response status
    if(response.body.status !== 200) {
        throw new Error(response.body.msg);
    }

    // get upload agent url
    let uploadAgentUrl = response.body.result.url;

    const form = new FormData();

    const attachment = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    form.append(fileName, attachment, {
        filename: fileName,
    });

    let agentResponse = await got.post(uploadAgentUrl, {
        body : form
    });

    agentResponse.body = JSON.parse(agentResponse.body);

    // check response status
    if(agentResponse.body.status !== 200) {
        throw new Error(agentResponse.body.msg);
    }

    return agentResponse.body.result;

};

const sha1 = path => new Promise((resolve, reject) => {
    const hash = require('crypto').createHash('sha1');
    const rs = fs.createReadStream(path);
    rs.on('error', reject);
    rs.on('data', chunk => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
});
