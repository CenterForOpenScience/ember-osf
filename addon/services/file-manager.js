import Ember from 'ember';

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    // TODO: After each waterbutler action, either update the Ember
    // store based on the returned WB entity, or force a refresh of 
    // file info through the OSF. Or maybe both?

    // File actions
    getContents(file) {
        var url = file.get('links').download;
        return this._waterbutlerRequest('GET', url);
    },

    updateContents(file, contents) {
        var url = file.get('links').upload;
        return this._waterbutlerRequest('PUT', url, {
            kind: 'file'
        }, contents);
    },

    checkout(file, user) {
        // TODO? Having checkout here makes more sense to me than making it
        // the only writable attribute on the file model.
    },

    // Folder actions
    addSubfolder(folder, name) {
        var url = folder.get('links').new_folder;
        var params = {
            name,
            kind: 'folder'
        };

        // HACK: This is the only link that already has a query string
        if (url.search(/\?kind=folder$/) > -1) {
            url = `${url}&name=${name}`;
            params = undefined;
        }

        return this._waterbutlerRequest('PUT', url, params);
    },

    uploadFile(folder, name, contents) {
        var url = folder.get('links').upload;
        return this._waterbutlerRequest('PUT', url, {
            name,
            kind: 'file'
        }, contents);
    },

    // File and folder actions
    rename(file, newName) {
        var url = file.get('links').move;
        return this._waterbutlerRequest('POST', url, null,
                JSON.stringify({ action: 'rename', rename: newName }));
    },

    move(file, targetFolder, newName=null, replace=true,
            node=null, provider=null, action='move') {
        var url = file.get('links').move;
        var data = {
            action,
            path: targetFolder.get('path'),
            conflict: replace ? 'replace' : 'keep'
        };
        if (newName) {
            data.rename = newName;
        }
        if (node) {
            if (typeof node === 'string') {
                data.resource = node;
            } else {
                data.resource = node.get('id');
            }
        }
        if (provider) {
            data.provider = provider;
        }
        return this._waterbutlerRequest('POST', url, null, data);
    },

    copy(file, targetFolder, newName=null, replace=true,
            node=null, provider=null) {
        return this.move(file, targetFolder, newName, replace,
                node, provider, 'copy');
    },

    deleteFile(file) {
        var url = file.get('links').delete;
        return this._waterbutlerRequest('DELETE', url);
    },

    _waterbutlerRequest(method, url, queryParams=null, data=null) {
        if (!url) {
            return Ember.RSVP.Promise.reject('That file/folder has no link for that action!');
        }
        if (queryParams) {
            let queryString = Ember.$.param(queryParams);
            url = `${url}?${queryString}`;
        }
        var sessionData = this.get('session').get('data').authenticated;
        var accessToken = sessionData.attributes.accessToken;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax(url, {
                method,
                data,
                processData: false,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                error(_, __, errorMsg) {
                    reject(new Error(errorMsg));
                },
                success(response) {
                    resolve(response);
                }
            });
        });
    }
});
