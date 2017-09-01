const API_VERSION = 1;
const API_URL = "https://api.openload.co/" + API_VERSION;

const request = require("./utils/request.js");
const upload = require("./utils/upload.js");

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

        if(typeof config !== "object"){
            throw new Error("Missing 'config' parameter.");
        }

        if(typeof config.login !== "string"){
            throw new Error("Invalid 'config.login' parameter.");
        }

        if(typeof config.key !== "string"){
            throw new Error("Invalid 'config.key' parameter.");
        }

        // save login params
        this._config = {
            'login' : config.login,
            'key'   : config.key
        };

    }

    /**
     * Gets account info
     *
     * @return {Object}
     */
    async getAccountInfo(){
        return await request( API_URL + "/account/info", this._config );
    }

    /**
     * Gets a download ticket
     * After you complete the captcha from this ticket you need to
     * make a call for the download link
     *
     * @param {String} fileId The ID of the file you want to request the download ticket
     * @return {Object}
     */
    async getDownloadTicket( fileId ){

        if(typeof fileId !== 'string'){
            throw new Error("Invalid 'fileId' parameter.");
        }

        return await request( API_URL + "/file/dlticket", Object.assign(this._config, {
            'file' : fileId
        }));

    }

    /**
     * Gets a download link for a specific download ticket
     *
     * @param {String} ticketId
     * @param {String} captchaResponse
     * @return {Object}
     */
    async getDownloadLink( ticketId, captchaResponse ){

        if(typeof fileId !== 'string'){
            throw new Error("Invalid 'fileId' parameter.");
        }

        return await request( API_URL + "/file/dl", Object.assign(this._config, {
            'ticket'           : ticketId,
            'captcha_response' : captchaResponse
        }));

    }

    /**
     * Gets file info by file id
     *
     * @param {String|String[]} fileId
     * @return {Object}
     */
    async getFileInfo( fileId ){

        let singleMode;
        let ids;

        // check parameter
        if(typeof fileId === 'string'){
            singleMode = (fileId.indexOf(",") === -1);
            ids = fileId;
        } else if (Array.isArray(fileId)){
            singleMode = false;
            ids = fileId.join(",");
        } else {
            throw new Error("Invalid 'fileId' parameter.");
        }

        // make request
        let results = await request( API_URL + "/file/info", Object.assign(this._config, {
            'file': ids
        }));

        // return result(s)
        return singleMode ? results : results[ids];

    }

    /**
     * Upload a file and returns the remote file id
     *
     * @param {String|Stream} file
     * @param {String} folderId
     * @returns {Object}
     */
    async uploadFile( filePath, folderId ){

        const fs = require('fs');

        if(typeof filePath === 'string'){
            if(!fs.existsSync(filePath)) {
                throw new Error("Invalid 'filePath' parameter. File path does not exist.");
            }
        } else {
            throw new Error("Invalid 'filePath' parameter.");
        }

        return await upload( API_URL + "/file/ul", filePath, Object.assign(this._config, {
            'folder' : folderId,
        }));

    }

    /**
     * Deletes a file by its ID from Openload Servers
     *
     * @param {String} fileId
     * @return {Boolean}
     */
    async deleteFile( fileId ){

        if(typeof fileId !== 'string'){
            throw new Error("Invalid 'fileId' parameter.");
        }

        return await request( API_URL + "/file/delete", Object.assign(this._config, {
            'file' : fileId
        }));

    }

    /**
     * Adds a remote download task on the Openload Servers
     *
     * @param {String} url
     * @param {String} folderId
     * @param {String|String[]} headers
     * @return {Object}
     */
    async addRemoteDownload( url, folderId, headers ){

        const { URL } = require('url');
        const downloadUrl = new URL(url);

        return await request( API_URL + "/remotedl/add", Object.assign(this._config, {
            'url'     : url,
            'folder'  : folderId,
            'headers' : headers || ""
        }));

    }

    /**
     * Checks the status of a download task on Openload Servers
     *
     * @param {String} downloadTaskId
     * @param {Number} limit
     * @return {Object}
     */
    async checkRemoteUploadStatus( downloadTaskId, limit ){

        if(typeof downloadTaskId !== 'string'){
            throw new Error("Invalid 'downloadTaskId' parameter.");
        }
        if(typeof downloadTaskId !== 'number' && typeof downloadTaskId !== 'undefined'){
            throw new Error("Invalid 'limit' parameter.");
        }

        return await request( API_URL + "/remotedl/status", Object.assign(this._config, {
            'id' : downloadTaskId,
            'limit' : limit || 5
        }));

    }

    /**
     * List the contents of a folder
     *
     * @param {String} folderId
     * @return {Object}
     */
    async listFolder( folderId ){

        if(typeof folderId !== 'string'){
            throw new Error("Invalid 'folderId' parameter.");
        }

        return await request( API_URL + "/file/listfolder", Object.assign(this._config, {
            'folder' : folderId
        }));

    }

    /**
     * Renames a folder
     *
     * @param {String} folderId
     * @param {String} newFolderName
     * @return {Boolean}
     */
    async renameFolder( folderId, newFolderName ){

        if(typeof folderId !== 'string'){
            throw new Error("Invalid 'folderId' parameter.");
        }

        if(typeof newFolderName !== 'string'){
            throw new Error("Invalid 'newFolderName' parameter.");
        }

        return await request( API_URL + "/file/renamefolder", Object.assign(this._config, {
            'folder' : folderId,
            'name'   : newFolderName
        }));

    }

    /**
     * Renames a folder
     *
     * @param {String} fileId
     * @param {String} newFileName
     * @return {Boolean}
     */
    async renameFile( fileId, newFileName ){

        if(typeof fileId !== 'string'){
            throw new Error("Invalid 'fileId' parameter.");
        }

        if(typeof newFileName !== 'string'){
            throw new Error("Invalid 'newFileName' parameter.");
        }

        return await request( API_URL + "/file/renamefile", Object.assign(this._config, {
            'file' : fileId,
            'name' : newFileName
        }));

    }

    /**
     * Converts a previously uploaded file to a browser-streamable format (mp4 / h.264)
     *
     * @param {String} fileId
     * @return {Boolean}
     */
    async convertFile( fileId ){

        if(typeof fileId !== 'string'){
            throw new Error("Invalid 'fileId' parameter.");
        }

        return await request( API_URL + "/file/convert", Object.assign(this._config, {
            'file' : fileId
        }));

    }

    /**
     * Gets all in-progress conversion tasks from a folder
     *
     * @param {String} folderId
     * @return {Object}
     */
    async getRunningConversionTasks( folderId ){

        if(typeof folderId !== 'string' && typeof folderId !== 'undefined'){
            throw new Error("Invalid 'folderId' parameter.");
        }

        return await request( API_URL + "/file/runningconverts", Object.assign(this._config, {
            'folder' : folderId
        }));

    }

    /**
     * Gets the splash image for a media file
     *
     * @param {String} fileId
     * @return {Object}
     */
    async getSplashImage( fileId ){

        if(typeof fileId !== 'string'){
            throw new Error("Invalid 'fileId' parameter.");
        }

        return await request( API_URL + "/file/getsplash", Object.assign(this._config, {
            'file' : fileId
        }));

    }

}

module.exports = OpenloadClient;
