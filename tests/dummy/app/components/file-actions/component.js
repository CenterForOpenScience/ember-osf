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

        updateContents(evt) {
            let contents = evt.target.files[0];
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

        uploadFile(evt) {
            let newFile = evt.target.files[0];
            let folder = this.get('file');
            if (newFile) {
                let fm = this.get('fileManager');
                fm.uploadFile(folder, newFile.name, newFile).then(() => {
                    this.get('onChange')();
                });
            }
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
                this.get('onChange')();
            });
        },

        moveFile(folderId) {
            let file = this.get('file');
            let store = this.get('store');
            let folder = store.peekRecord('file', folderId);
            if (!folder) {
                folder = store.peekRecord('file-provider', folderId);
                if (!folder) {
                    debugger;
                }
                // TODO errors
            }
            let options = {
                node: this.get('moveNode'),
                provider: folder.get('provider'),
                replace: this.get('moveReplace'),
                copy: this.get('moveCopy'),
                newName: this.get('moveName')
            };

            let p = this.get('fileManager').move(file, folder, options);
            p.then(() => this.get('onChange'));
        }
    }
});
