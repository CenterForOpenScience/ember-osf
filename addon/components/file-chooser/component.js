import Ember from 'ember';
import layout from './template';

/*
 * file-chooser component
 *
 * This component lets the user choose files from their computer, either through
 * a file browser or by drag-and-drop. 
 *
 * Exposed to parent context (bindable attributes)
 *  - `onChoose`: action called each time a file is added, with the new File
 *          object as the only argument
 *  - `files`: mutable list of chosen File objects
 *
 * Exposed to child context (block)
 *  - `files`: mutable list of chosen File objects, yielded to block
 *  - `errorMessage`: most recent error message, yielded to block
 *  - `onFileInputChange`: action to handle files chosen through a file input
 *          e.g. `{{input type='file' change=(action 'onFileInputChange')}}`
 *
 * Styling
 *  - This component's element has the `drop-zone` class
 *  - While the user is holding dragged files over this component, it
 *    has the `drop-zone-ready` class
 */

export default Ember.Component.extend({
    layout,
    classNames: ['drop-zone'],
    classNameBindings: ['dropZoneReady'],
    dropZoneReady: false,
    files: Ember.A(),

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
            p.then(() => this.actions.onChooseFile(file));
            p.catch(() => this.set('errorMessage',
                `Cannot upload directories (${file.name})`));
        }
    },

    actions: {
        onFileInputChange(event) {
            for (let i = 0; i < event.target.files.length; i++) {
                let file = event.target.files[i];
                this.actions.onChooseFile(file);
            }
        },

        onChooseFile(file) {
            this.get('files').pushObject(file);
            let onChoose = this.get('onChoose');
            if (onChoose) {
                onChoose(file);
            }
        }
    },

    _fileCheck(file) {
        // HACK: There's not a cross-browser way to see the contents of
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
