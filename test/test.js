const assert = require('assert');
const path = require("path");

const Openload = require("./../index.js");
const credentials = require("./credentials.js");

let client = new Openload({ 'login' : credentials.login, 'key' : credentials.key });

let fileId;

describe('Basic Test Suite', function() {

    describe('#getAccountInfo()', function() {

        it("should get account info", async function(){

            let result = await client.getAccountInfo();

            if(result === null){
                assert.fail("No response.");
            }

        });

    });

    describe('#uploadFile()', function() {

        it("should upload file", async function(){

            let result = await client.uploadFile(path.resolve(__dirname, "testFile.txt"));

            if(result === null){
                assert.fail("Upload failed.");
            }

            fileId = result.id;

        });

    });

    describe('#deleteFile()', function() {

        it("should delete file", async function(){

            let result = await client.deleteFile( fileId );

            if(result !== true){
                assert.fail("Delete failed.");
            }

        });

    });

});
