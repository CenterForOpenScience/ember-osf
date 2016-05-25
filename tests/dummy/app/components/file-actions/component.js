import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    fileManager: Ember.inject.service(),
    store: Ember.inject.service(),

    actions: {
        download() {
            let file = this.get('file');
            let url = file.get('links').download;
            window.open(url);
        },

        updateContents(contents) {
            let file = this.get('file');
            let fm = this.get('fileManager');

            fm.updateContents(file, contents).then(() => {
                this.get('onChange')();
            });
        },

        addSubfolder(name) {
            let folder = this.get('file');
            if (name) {
                let p = this.get('fileManager').addSubfolder(folder, name);
                p.then(() => {
                    this.get('onChange')();
                });
            }
        },

        uploadFiles(files) {
            let fm = this.get('fileManager');
            let folder = this.get('file');
            while (files && files.length) {
                let file = files.pop();
                fm.uploadFile(folder, file.name, file).then(() => {
                    this.get('onChange')();
                });
            }
        },

        rename(newName) {
            let file = this.get('file');
            if (newName) {
                let p = this.get('fileManager').rename(file, newName);
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
                this.get('onChange')();
            });
        },

        moveFile(folderId) {
            let file = this.get('file');
            let store = this.get('store');
            let folder = store.findRecord('file', folderId);
            if (!folder) {
                folder = store.findRecord('file-provider', folderId);
                if (!folder) {
                    return;
                }
            }
            let options = {
                node: this.get('moveNode'),
                provider: folder.get('provider'),
                replace: this.get('moveReplace'),
                copy: this.get('moveCopy'),
                newName: this.get('moveName')
            };

            let p = this.get('fileManager').move(file, folder, options);
            p.then(() => this.get('onChange')());
        }
    }
});
