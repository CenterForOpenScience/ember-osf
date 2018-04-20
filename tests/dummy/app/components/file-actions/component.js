import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
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

            fm.updateContents(file, contents);
        },

        addSubfolder(name) {
            let folder = this.get('file');
            if (name) {
                this.get('fileManager').addSubfolder(folder, name);
            }
        },

        uploadFiles(files) {
            let fm = this.get('fileManager');
            let folder = this.get('file');
            while (files && files.length) {
                let file = files.pop();
                fm.uploadFile(folder, file.name, file);
            }
        },

        rename(newName) {
            let file = this.get('file');
            if (newName) {
                this.get('fileManager').rename(file, newName);
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
            store.findRecord('file', folderId).then((folder) => {
                // TODO: moving to file-provider root
                let options = {
                    node: this.get('moveNode'),
                    provider: folder.get('provider'),
                    replace: this.get('moveReplace'),
                    copy: this.get('moveCopy'),
                    newName: this.get('moveName')
                };

                this.get('fileManager').move(file, folder, options);
            });
        }
    }
});
