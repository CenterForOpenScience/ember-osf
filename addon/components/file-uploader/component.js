import Ember from 'ember';
import layout from './template';

// TODO: Upload progress?

export default Ember.Component.extend({
    layout,
    fileManager: Ember.inject.service(),
    classNames: ['file-uploader'],
    classNameBindings: ['canDrop:valid-drop-zone'],
    canDrop: false,
    currentUploads: [],
    errors: [],

    dragOver(event) {
        if (event.dataTransfer.files.length) {
            // Stop the event bubbling, so this can accept the drag/drop
            return false;
        }
    },

    dragEnter(event) {
        if (event.dataTransfer.files.length) {
            this.set('canDrop', true);
            // Stop the event bubbling, so this can accept the drag/drop
            return false;
        }
    },

    dragLeave(event) {
        this.set('canDrop', false);
    },

    drop(event) {
        let fm = this.get('fileManager');
        let folder = this.get('uploadFolder');
        for (let file in event.dataTransfer.files) {
            this.get('currentUploads').pushObject(file);
            let p = fm.uploadFile(folder, file.name, file);
            p.then(() => {
                this.get('currentUploads').removeObject(file);
            }).catch((error) => {
                this.get('errors').pushObject(error);
                this.get('currentUploads').removeObject(file);
            });
        }
    },

    actions: {
        fileUploaded() {
        }
    }
});
