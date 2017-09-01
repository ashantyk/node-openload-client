const got = require('got');

// method used to call Openload remote API methods
module.exports = async (url, params) => {

    // make request
    let response = await got(url, {
        method : 'GET',
        json   :  true,
        query  : params,
    });

    // check response status
    if(response.body.status !== 200) {
        throw new Error(response.body.msg);
    }

    // return response result
    return response.body.result;

};
