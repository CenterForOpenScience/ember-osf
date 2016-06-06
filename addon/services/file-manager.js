import Ember from 'ember';

/**
 * An Ember service for doing things to files.
 * Essentially a wrapper for the Waterbutler API.
 * http://waterbutler.readthedocs.io/
 *
 * @class file-manager
 * @extends Ember.Service
 */

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    isReloading: false,

    /**
     * Download the contents of the given file.
     *
     * @method getContents
     * @param {file} file A `file` model with `isFolder == false`.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the file contents or rejects
     * with an error message.
     */
    getContents(file, options = {}) {
        let url = file.get('links').download;
        return this._waterbutlerRequest('GET', url, options);
    },

    /**
     * Upload a new version of an existing file.
     *
     * @method updateContents
     * @param {file} file A `file` model with `isFolder == false`.
     * @param {Object} contents A native `File` object or another appropriate
     * payload for uploading.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the updated `file` model or
     * rejects with an error message.
     */
    updateContents(file, contents, options = {}) {
        let url = file.get('links').upload;
        if (!options.query) {
            options.query = {};
        }
        options.query.kind = 'file';
        options.data = contents;

        let p = this._waterbutlerRequest('PUT', url, options);
        return p.then(() => this._reloadModel(file));
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
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the new folder's model or
     * rejects with an error message.
     */
    addSubfolder(folder, name, options = {}) {
        let url = folder.get('links').new_folder;
        if (!options.query) {
            options.query = {};
        }
        options.query.name = name;
        options.query.kind = 'folder';

        // HACK: This is the only WB link that already has a query string
        let queryStart = url.search(/\?kind=folder$/);
        if (queryStart > -1) {
            url = url.slice(0, queryStart);
        }
        let p = this._waterbutlerRequest('PUT', url, options);
        return p.then(() => this._getNewFileInfo(folder, name));
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
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    uploadFile(folder, name, contents, options = {}) {
        let url = folder.get('links').upload;
        options.data = contents;
        if (!options.query) {
            options.query = {};
        }
        options.query.name = name;
        options.query.kind = 'file';

        let p = this._waterbutlerRequest('PUT', url, options);
        return p.then(() => this._getNewFileInfo(folder, name));
    },

    /**
     * Rename a file or folder
     *
     * @method rename
     * @param {file} file `file` model to rename.
     * @param {String} newName New name for the file.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the updated `file` model or
     * rejects with an error message.
     */
    rename(file, newName, options = {}) {
        let url = file.get('links').move;
        options.data = JSON.stringify({ action: 'rename', rename: newName });

        let p = this._waterbutlerRequest('POST', url, options);
        return p.then(() => this._reloadModel(file));
    },

    /**
     * Move (or copy) a file or folder
     *
     * @method move
     * @param {file} file `file` model to move.
     * @param {file} targetFolder Where to move the file, a `file` model with
     * `isFolder == true`.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @param {String} [options.data.rename] If specified, also rename the file
     * to the given name.
     * @param {String} [options.data.resource] Optional node ID. If specified,
     * move the file to that node.
     * @param {String} [options.data.provider] Optional provider name. If
     * specified, move the file to that provider.
     * @param {String} [options.data.action='move'] Either 'move' or 'copy'.
     * @param {String} [options.data.conflict='replace'] Specifies what to do if
     * a file of the same name already exists in the target folder. If 'keep',
     * rename this file to avoid conflict. If replace, the existing file is
     * destroyed.
     * @return {Promise} Promise that resolves to the the updated (or newly
     * created) `file` model or rejects with an error message.
     */
    move(file, targetFolder, options = {}) {
        let url = file.get('links').move;
        let defaultData = {
            action: 'move',
            path: targetFolder.get('path')
        };
        Ember.$.extend(defaultData, options.data);
        options.data = JSON.stringify(defaultData);

        let p = this._waterbutlerRequest('POST', url, options);
        return p.then((wbResponse) => {
            let name = wbResponse.data.attributes.name;
            return this._getNewFileInfo(targetFolder, name);
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
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @param {String} [options.data.rename] If specified, also rename the file
     * to the given name.
     * @param {String} [options.data.resource] Optional node ID. If specified,
     * move the file to that node.
     * @param {String} [options.data.provider] Optional provider name. If
     * specified, move the file to that provider.
     * @param {String} [options.data.conflict='replace'] Specifies what to do if
     * a file of the same name already exists in the target folder. If 'keep',
     * rename this file to avoid conflict. If replace, the existing file is
     * destroyed.
     * @return {Promise} Promise that resolves to the the new `file` model or
     * rejects with an error message.
     */
    copy(file, targetFolder, options={}) {
        if (!options.data) {
            options.data = {};
        }
        options.data.action = 'copy';
        return this.move(file, targetFolder, options);
    },

    /**
     * Delete a file or folder
     *
     * @method deleteFile
     * @param {file} file `file` model to delete.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves on success or rejects with an
     * error message.
     */
    deleteFile(file, options = {}) {
        let url = file.get('links').delete;
        let p = this._waterbutlerRequest('DELETE', url, options);
        return p.then(() => file.get('parentFolder').then((parent) => {
                if (parent) {
                    return this._reloadModel(parent.get('files'));
                } else {
                    this.get('store').unloadRecord(file);
                    return true;
                }
            })
        );
    },

    /**
     * Make a Waterbutler request
     *
     * @method _waterbutlerRequest
     * @private
     * @param {String} method HTTP method for the request.
     * @param {String} url Waterbutler URL.
     * @param {Object} [options] Options hash
     * @param {Object} [options.query] Key-value hash of query parameters to
     * add to the request URL.
     * @param {Object} [options.data] Payload to be sent.
     * @return {Promise} Promise that resolves to the data returned from the
     * server on success, or rejects with an error message.
     */
    _waterbutlerRequest(method, url, options = {}) {
        if (options.query) {
            let queryString = Ember.$.param(options.query);
            url = `${url}?${queryString}`;
        }

        let headers = {};
        this.get('session').authorize('authorizer:osf-token', (headerName, content) => {
            headers[headerName] = content;
        });

        return new Ember.RSVP.Promise((resolve, reject) => {
            let p = Ember.$.ajax(url, {
                method,
                headers,
                data: options.data,
                processData: false
            });
            p.done((data) => resolve(data));
            p.fail((_, __, error) => reject(error));
        });
    },

    /**
     * Force-reload a model from the API.
     *
     * @method _reloadModel
     * @private
     * @param {Object} model Any Ember model with a `reload` method.
     * @return {Promise} Promise that resolves to the reloaded model or
     * rejects with an error message.
     */
    _reloadModel(model) {
        this.set('isReloading', true);
        return model.reload().then((freshModel) => {
            this.set('isReloading', false);
            return freshModel;
        }).catch((error) => {
            this.set('isReloading', false);
            throw error;
        });
    },

    /**
     * Get the `file` model for a newly created file.
     *
     * @method _getNewFileInfo
     * @private
     * @param {file} parentFolder Model for the new file's parent folder.
     * @param {String} name Name of the new file.
     * @return {Promise} Promise that resolves to the new file's model or
     * rejects with an error message.
     */
    _getNewFileInfo(parentFolder, name) {
        let p = this._reloadModel(parentFolder.get('files'));
        return p.then((files) => files.findBy('name', name));
    }
});
