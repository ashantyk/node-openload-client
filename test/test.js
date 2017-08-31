const assert = require('assert');

const Client = require("./../index.js").Client;
const credentials = require("./credentials.js");

let client = new Client({ 'login' : credentials.login, 'key' : credentials.key });

describe('Basic Test Suite', function() {

    describe('#getAccountInfo()', function() {

        it("should get account info", async function(){

            let result = await client.getAccountInfo();

        });

    });

});
