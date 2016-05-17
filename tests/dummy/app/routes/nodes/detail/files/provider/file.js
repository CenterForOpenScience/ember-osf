import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    fileManager: Ember.inject.service(),

    model(params) {
        // TODO: verify that this file actually belongs to the parent node?
        return this.store.findRecord('file', params.file_id);
    },

    actions: {
        addSubfolder(name) {
            let folder = this.modelFor(this.routeName);
            if (name && folder.get('isFolder')) {
                let p = this.get('fileManager').addSubfolder(folder, name);
                p.then(() => {
                    this.store.unloadRecord(folder);
                    this.refresh();
                });
            }
        },

        uploadFile() {
        },

        rename(newName) {
            let file = this.modelFor(this.routeName);
            if (newName && newName !== file.get('name')) {
                let p = this.get('fileManager').rename(file, newName);
                p.then(() => {
                    file.set('name', newName);
                    this.refresh();
                });
            }
        },

        deleteFile() {
            let file = this.modelFor(this.routeName);
            let p = this.get('fileManager').deleteFile(file);
            p.then(() => {
                this.store.unloadRecord(file);
                let node = this.modelFor('nodes.detail');
                this.replaceWith('nodes.detail.files.provider', 
                    node, file.get('provider'));
            });
        }
    }
});
