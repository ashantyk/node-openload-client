const API_VERSION = 1;
const API_URL = "https://api.openload.co/" + API_VERSION;

const got = require('got');
const ClientError = require('./exception.js');
const ApiResponseCodes = require('./exception.js');

class OpenloadClient {

    /**
     * Class constructor
     *
     * @param {Object} config
     * @param {String} config.login The API login id you get from Openload 
     * @param {String} config.key The API key you get from Openload 
     */
    constructor( config ){

        // validate params

        if(typeof config != "object"){
            throw new Error("Missing 'config' parameter.");
        }

        if(typeof config.login != "string"){
            throw new Error("Invalid 'config.login' parameter.");
        }

        if(typeof config.key != "string"){
            throw new Error("Invalid 'config.key' parameter.");
        }

        // save login params
        this._apiKey = config.key;
        this._apiLogin = config.login;

    }

    /**
     * Gets account info
     *
     * Calls https://api.openload.co/1/account/info
     *
     * @return {Object}
     */
    async getAccountInfo(){
        return await this._callApi( "/account/info" );
    }

    /**
     * Makes the call to Openload API
     *
     * @param {String} path The relative URL path for the API method
     * @param {Object} params Additional (optional) parameters to be passed to the API 
     * @return {Object}
     */
    async _callApi(path, params){

        // build base url
        let url = API_URL + path;

        // append credentials
        url += "?login=" + this._apiLogin + "&key=" + this._apiKey;

        // append additional params (if any)
        if(typeof "params" == 'object'){
            for(let paramName in params){
                url += "&" + paramName + "=" + params[paramName];
            }
        }

        let response = await got(url, {
            "json": true
        });

        if(response.body.code == ApiResponseCodes.OK){
            return response.body.result;
        }

        throw new ClientError(response.body.msg, response.body.code);

    }


}

module.exports = OpenloadClient;
