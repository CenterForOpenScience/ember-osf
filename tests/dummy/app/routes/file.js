import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    fileManager: Ember.inject.service(),

    model(params) {
        // File provider IDs are 'nodeid:provider'
        if (params.file_id.includes(':')) {
            let [node_id, provider] = params.file_id.split(':');
            let node = this.store.findRecord('node', node_id);
            if (node) {
                let files = node.get('files');
                let name = node.get('name');
                if (files) {
                    return files.findBy('provider', provider);
                }
            }
        }

        return this.store.findRecord('file', params.file_id);
    },

    actions: {
        addSubfolder(name) {
            if (name) {
                var folder = this.modelFor(this.routeName);
                var p = this.get('fileManager').addSubfolder(folder, name);
                p.then(() => {
                    this.store.unloadRecord(folder);
                    this.refresh();
                });
            }
        },

        uploadFile() {
        },

        rename(newName) {
            if (newName) {
                var file = this.modelFor(this.routeName);
                var p = this.get('fileManager').rename(file, newName);
                p.then(() => {
                    file.set('name', newName);
                    this.refresh();
                });
            }
        },

        deleteFile() {
            var file = this.modelFor(this.routeName);
            var p = this.get('fileManager').deleteFile(file);
            p.then(() => {
                this.store.unloadRecord(file);
                this.refresh();
            });
        }
    }
});
