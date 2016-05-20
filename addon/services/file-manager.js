import Ember from 'ember';

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    // TODO: After performing a Waterbutler action, it takes a little while
    // (maybe a minute, depending on caching options) for the OSF API to catch
    // up and start serving the updated metadata.
    //
    // For actions on existing entities, this is fine, and file-manager
    // uses info from WB to update the Ember store so everything looks right
    // to the user, right away.
    //
    // For actions that create entities (addSubfolder, uploadFile, copy),
    // this is a problem, because we need the OSF info (guid, WB links)
    // before letting the user do anything to their new file. At the moment,
    // after you create a file, you should go get a cup of coffee, come back,
    // and hard reload.


    ///////////////////// File-only actions /////////////////////

    getContents(file) {
        let url = file.get('links').download;
        return this._waterbutlerRequest('GET', url);
    },

    updateContents(file, contents) {
        let url = file.get('links').upload;
        let params = { kind: 'file' };
        return this._waterbutlerRequest('PUT', url, params, contents);
    },

    checkout(/*file, user*/) {
        // TODO? Having checkout here makes more sense to me than making it
        // the only writable attribute on the file model.
    },


    ///////////////////// Folder-only actions /////////////////////

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
        return this._waterbutlerRequest('PUT', url, params);
    },

    uploadFile(folder, name, contents) {
        let url = folder.get('links').upload;
        let params = {
            name,
            kind: 'file'
        };
        return this._waterbutlerRequest('PUT', url, params, contents);
    },


    ///////////////////// File and folder actions /////////////////////

    rename(file, newName) {
        let url = file.get('links').move;
        let data = JSON.stringify({ action: 'rename', rename: newName });
        let p = this._waterbutlerRequest('POST', url, null, data);
        return p.then((data) => {
            return this._pushToStore(data, file.get('id'));
        });
    },

    move(file, targetFolder, { newName=null, replace=true,
            node=null, provider=null, copy=false }) {
        let url = file.get('links').move;
        let data = {
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

        let p = this._waterbutlerRequest('POST', url, null, JSON.stringify(data));
        return p.then((data) => {
            if (copy) {
                // TODO get new file's info from OSF
            } else {
                return this._pushToStore(data, file.get('id'), targetFolder);
            }
        });
    },

    copy(file, targetFolder, { newName=null, replace=true,
            node=null, provider=null }) {
        return this.move(file, targetFolder, 
                { newName, replace, node, provider, copy: true });
    },

    deleteFile(file) {
        let url = file.get('links').delete;
        let p = this._waterbutlerRequest('DELETE', url);
        return p.then(() => {
            let parentFolder = file.get('parentFolder');
            if (parentFolder) {
                parentFolder.get('files').removeObject(file);
            }
        });
    },


    ///////////////////// Privates /////////////////////

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

    _pushToStore(data, id, parentFolder) {
        // Hack the Waterbutler entity to look like the file Ember expects
        data.data.id = id;
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
