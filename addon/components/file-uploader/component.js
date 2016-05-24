import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    fileManager: Ember.inject.service(),
    classNames: ['drop-zone'],
    classNameBindings: ['dropZoneReady'],
    dropZoneReady: false,
    currentUploads: Ember.A(),
    completedUploads: Ember.A(),
    errorMessage: null,

    dragOver(event) {
        if (event.dataTransfer.types.indexOf('Files') > -1) {
            this.set('dropZoneReady', true);
            event.dataTransfer.dropEffect = 'move';
            return false;
        } else {
            event.dataTransfer.dropEffect = 'none';
        }
    },

    dragLeave(event) {
        this.set('dropZoneReady', false);
        event.dataTransfer.dropEffect = '';
    },

    drop(event) {
        event.preventDefault();
        this.set('dropZoneReady', false);
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            let file = event.dataTransfer.files[i];
            let p = this._fileCheck(file);
            p.then(() => this._uploadFile(file));
            p.catch(() => this.set('errorMessage',
                `Cannot upload directories (${file.name})`));
        }
    },

    actions: {
        uploadFile(event) {
            for (let i = 0; i < event.target.files.length; i++) {
                let file = event.target.files[i];
                this._uploadFile(file);
            }
        }
    },

    _uploadFile(file) {
        this.get('currentUploads').pushObject(file);
        let folder = this.get('uploadFolder');
        let p = this.get('fileManager').uploadFile(folder, file.name, file);
        p.then(() => {
            this.get('currentUploads').removeObject(file);
            this.get('completedUploads').pushObject(file);
        }).catch((error) => {
            this.get('currentUploads').removeObject(file);
            this.set('errorMessage', error);
        });
    },

    _fileCheck(file) {
        // HACK: There's not a cross-browser way to upload the contents of
        // dragged-and-dropped directories, but there's also not a good way to
        // tell whether a given File object is a directory. Hence, this:
        return new Promise(function(resolve, reject) {
            let reader = new FileReader();
            reader.onload = () => resolve(); // it's a file
            reader.onerror = () => reject(); // it's a directory or something
            reader.readAsText(file.slice(0, 5));
        });
    }
});
