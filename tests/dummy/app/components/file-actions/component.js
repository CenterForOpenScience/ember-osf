import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    fileManager: Ember.inject.service(),
    store: Ember.inject.service(),

    actions: {
        addSubfolder(name) {
            let folder = this.get('file');
            if (name) {
                let p = this.get('fileManager').addSubfolder(folder, name);
                p.then(() => {
                    this.get('store').unloadRecord(folder);
                    this.get('onChange')();
                });
            }
        },

        uploadFile() {
        },

        rename(newName) {
            let file = this.get('file');
            if (newName) {
                let p = this.get('fileManager').rename(file, newName);
                let onChange = this.get('onChange');
                p.then(() => {
                    file.set('name', newName);
                    this.get('onChange')();
                });
            }
        },

        deleteFile() {
            let file = this.get('file');
            let p = this.get('fileManager').deleteFile(file);
            p.then(() => {
                file.get('parentFolder').get('files').removeObject(file);
                this.get('onChange')();
            });
        }
    }
});
