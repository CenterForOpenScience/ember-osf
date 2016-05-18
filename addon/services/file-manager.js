import Ember from 'ember';

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    // TODO: After each waterbutler action, either update the Ember
    // store based on the returned WB entity (when possible), or force a
    // refresh of file info through the OSF. Or maybe both?

    // File actions
    getContents(file) {
        var url = file.get('links').download;
        return this._waterbutlerRequest('GET', url);
    },

    updateContents(file, contents) {
        var url = file.get('links').upload;
        var params = { kind: 'file' };
        return this._waterbutlerRequest('PUT', url, params);
    },

    checkout(file, user) {
        // TODO? Having checkout here makes more sense to me than making it
        // the only writable attribute on the file model.
    },

    // Folder actions
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

        let store = this.get('store');

        let p = this._waterbutlerRequest('PUT', url, params);
        return p.then((data) => {
            // TODO: figure out how to force a reload that actually works
            this.get('store').findRecord('file', folder.get('id'), {reload: true});
        });

    },

    uploadFile(folder, name, contents) {
        var url = folder.get('links').upload;
        var params = {
            name,
            kind: 'file'
        };
        var p = this._waterbutlerRequest('PUT', url, params, contents);
        return p.then((data) => {
            // TODO: figure out how to force a reload that actually works
            this.get('store').findRecord('file', folder.get('id'), {reload: true});
        });
    },

    // File and folder actions
    rename(file, newName) {
        var url = file.get('links').move;
        var data = JSON.stringify({ action: 'rename', rename: newName });
        var p = this._waterbutlerRequest('POST', url, null, data);
        return p.then((data) => {
            data.data.id = file.get('id');
            return this._addFileToStore(data);
        });
    },

    move(file, targetFolder, { newName=null, replace=true,
            node=null, provider=null, copy=false }) {
        var url = file.get('links').move;
        var data = {
            action: copy ? 'copy' : 'move',
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

        var p = this._waterbutlerRequest('POST', url, null, JSON.stringify(data));
        return p.then((data) => {
            if (!copy) {
                data.data.id = file.get('id');
            }
            // TODO force reload on copy
            return this._addFileToStore(data, targetFolder);
        });
    },

    copy(file, targetFolder, { newName=null, replace=true,
            node=null, provider=null }) {
        return this.move(file, targetFolder, 
                { newName, replace, node, provider, copy: true });
    },

    deleteFile(file) {
        var url = file.get('links').delete;
        var p = this._waterbutlerRequest('DELETE', url);
        return p.then(() => {
            let parentFolder = file.get('parentFolder');
            if (parentFolder) {
                parentFolder.get('files').removeObject(file);
            }
        });
    },

    _waterbutlerRequest(method, url, queryParams=null, data=null) {
        if (queryParams) {
            let queryString = Ember.$.param(queryParams);
            url = `${url}?${queryString}`;
        }
        var sessionData = this.get('session').get('data').authenticated;
        var accessToken = sessionData.attributes.accessToken;

        return new Ember.RSVP.Promise((resolve, reject) => {
            Ember.$.ajax(url, {
                method,
                data,
                processData: false,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                success: (data) => resolve(data),
                fail: (_, __, error) => reject(error)
            });
        });
    },

    _addFileToStore(data, parentFolder) {
        // Hack the Waterbutler entity to look like the file Ember expects
        data.data.type = 'file';
        let attr = data.data.attributes;
        attr.materializedPath = attr.materialized;
        attr.dateModified = attr.modified;

        let newFolder = this.get('store').push(data);

        if (parentFolder) {
            newFolder.set('parentFolder', parentFolder);
        }
        return newFolder;
    }
});
