import Ember from 'ember';

/**
 * An Ember service for doing things to files.
 * Essentially a wrapper for the Waterbutler API.
 *
 * @class file-manager
 * @extends Ember.Service
 */

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    /**
     * Download the contents of the given file.
     * 
     * @method getContents
     * @param {file} file A `file` model with `isFolder == false`.
     * @return {Promise} Promise that resolves to the file contents or rejects
     * with an error message.
     */
    getContents(file) {
        let url = file.get('links').download;
        return this._waterbutlerRequest('GET', url);
    },

    /**
     * Upload a new version of an existing file 
     *
     * @method updateContents
     * @param {file} file A `file` model with `isFolder == false`.
     * @param {Object} contents A native `File` object or another appropriate
     * payload for uploading.
     * @return {Promise} Promise that resolves on success or rejects with
     * an error message.
     */
    updateContents(file, contents) {
        let url = file.get('links').upload;
        let params = { kind: 'file' };
        return this._waterbutlerRequest('PUT', url, params, contents);
    },

    checkout(/*file, user*/) {
        // TODO? Having checkout here makes more sense to me than making it
        // the only writable attribute on the file model.
    },

    /**
     * Create a new folder
     *
     * @method addSubfolder
     * @param {file} folder Location of the new folder, a `file` model with
     * `isFolder == true`.
     * @param {String} name Name of the folder to create.
     * @return {Promise} Promise that resolves to the new folder's model or
     * rejects with an error message.
     */
    addSubfolder(folder, name) {
        let url = folder.get('links').new_folder;
        let params = {
            name,
            kind: 'folder'
        };

        // HACK: This is the only WB link that already has a query string
        let queryStart = url.search(/\?kind=folder$/);
        if (queryStart > -1) {
            url = url.slice(0, queryStart);
        }
        return new Ember.RSVP.Promise((resolve, reject) => {
            let p = this._waterbutlerRequest('PUT', url, params);
            p.then(() => {
                this._freshFile(folder, name).then((newFolder) => {
                    resolve(newFolder);
                });
            });
        });
    },

    /**
     * Upload a file
     *
     * @method uploadFile
     * @param {file} folder Location of the new file, a `file` model with
     * `isFolder == true`.
     * @param {String} name Name of the new file.
     * @param {Object} contents A native `File` object or another appropriate
     * payload for uploading.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    uploadFile(folder, name, contents) {
        let url = folder.get('links').upload;
        let params = {
            name,
            kind: 'file'
        };
        return new Ember.RSVP.Promise((resolve, reject) => {
            let p = this._waterbutlerRequest('PUT', url, params);
            p.then(() => {
                this._freshFile(folder, name).then((newFolder) => {
                    resolve(newFolder);
                });
            });
        });
    },

    /**
     * Rename a file or folder
     *
     * @method rename
     * @param {file} file `file` model to rename.
     * @param {String} newName New name for the file.
     * @return {Promise} Promise that resolves to the updated `file` model or
     * rejects with an error message.
     */
    rename(file, newName) {
        let url = file.get('links').move;
        let data = JSON.stringify({ action: 'rename', rename: newName });
        let p = this._waterbutlerRequest('POST', url, null, data);
        return p.then((data) => this._pushToStore(data, file.get('id')));
        // TODO refresh parent
    },

    /**
     * Move (or copy) a file or folder
     *
     * @method move
     * @param {file} file `file` model to move.
     * @param {file} targetFolder Where to move the file, a `file` model with
     * `isFolder == true`.
     * @param {Object} [options]
     * @param {String} [options.newName] If specified, also rename the file.
     * @param {Boolean} [options.replace=true] When `true`, replace any file with
     * the same name in the target location. When `false`, rename the moved file
     * to avoid conflict.
     * @param {node} [options.node] If specified, move the file to a different
     * node.
     * @param {String} [options.provider] If specified, move the file to a
     * different storage provider.
     * @param {Boolean} [options.copy=false] When `true`, create a copy of the
     * file instead of moving it.
     * @return {Promise} Promise that resolves to the the updated (or newly
     * created, if `options.copy == true`) `file` model or rejects with an error
     * message.
     */
    move(file, targetFolder, options = {}) {
        let url = file.get('links').move;
        let data = {
            action: options.copy ? 'copy' : 'move',
            path: targetFolder.get('path'),
            conflict: options.replace === false ? 'keep' : 'replace'
        };
        if (options.newName) {
            data.rename = options.newName;
        }
        if (options.node) {
            if (typeof options.node === 'string') {
                data.resource = options.node;
            } else {
                data.resource = options.node.get('id');
            }
        }
        if (options.provider) {
            data.provider = options.provider;
        }

        let p = this._waterbutlerRequest('POST', url, null, JSON.stringify(data));
        return p.then((data) => {
            if (!options.copy) {
                // TODO refresh parent
                return this._pushToStore(data, file.get('id'), targetFolder);
            }
        });
    },

    /**
     * Copy a file or folder.
     * Convenience method for `move` with `options.copy == true`.
     *
     * @method copy
     * @param {file} file `file` model to copy.
     * @param {file} targetFolder Where to copy the file, a `file` model with
     * `isFolder == true`.
     * @param {Object} [options]
     * @param {String} [options.newName] If specified, also rename the file.
     * @param {Boolean} [options.replace=true] When `true`, replace any file with
     * the same name in the target location. When `false`, rename the copied file
     * to avoid conflict.
     * @param {node} [options.node] If specified, copy the file to a different
     * node.
     * @param {String} [options.provider] If specified, copy the file to a
     * different storage provider.
     * @return {Promise} Promise that resolves to the the new `file` model or
     * rejects with an error message.
     */
    copy(file, targetFolder, options={}) {
        options.copy = true;
        return this.move(file, targetFolder, options);
    },

    /**
     * Delete a file or folder
     *
     * @method deleteFile
     * @param {file} file `file` model to delete.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    deleteFile(file) {
        let url = file.get('links').delete;
        let p = this._waterbutlerRequest('DELETE', url);
        return p.then(() => {
            // TODO refresh parent
            let parentFolder = file.get('parentFolder');
            if (parentFolder) {
                parentFolder.get('files').removeObject(file);
            }
        });
    },

    /**
     * Make a Waterbutler request
     *
     * @method _waterbutlerRequest
     * @private
     * @param {String} method HTTP method for the request.
     * @param {String} url Waterbutler URL.
     * @param {Object} [queryParams=null] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [data=null] Payload to be sent.
     * @return {Promise} Promise that resolves to the data returned from the
     * server on success, or rejects with an error message.
     */
    _waterbutlerRequest(method, url, queryParams=null, data=null) {
        if (queryParams) {
            let queryString = Ember.$.param(queryParams);
            url = `${url}?${queryString}`;
        }
        let sessionData = this.get('session').get('data').authenticated;
        let accessToken = sessionData.attributes.accessToken;

        return new Ember.RSVP.Promise((resolve, reject) => {
            Ember.$.ajax(url, {
                method,
                data,
                processData: false,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                success: (data) => resolve(data),
                error: (_, __, error) => reject(error)
            });
        });
    },

    /**
     * Get an updated `file` model from the OSF API.
     *
     * @method _updateFileInfo
     * @return {Promise} Promise that resolves to an updated `file` model or
     * rejects with an error message.
     */
    _freshFile(parentFolder, fileName) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            let runs = 0;
            let refresh = function() {
                runs++;
                parentFolder.get('files').reload().then((files) => {
                    let file = files.findBy('name', fileName);
                    if (file) {
                        resolve(file);
                    } else if (runs < 50) {
                        Ember.run.later(refresh, 250);
                    } else {
                        reject('Timed out refreshing file info');
                    }
                });
            };

            refresh();
        });
    }
});
