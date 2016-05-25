import Ember from 'ember';
import layout from './template';

/*
 * file-chooser component
 *
 * This component lets the user choose a list of files from their computer, by
 * drag-and-drop, a file browser, or whatever method the developer wants.
 *
 * Exposed to parent context (bindable attributes)
 *  - `onChoose`: function called each time a file is added, with the new File
 *          object as the only argument
 *  - `files`: mutable list of chosen File objects
 *
 * Exposed to block context
 *  - `this`: the component object itself, so the block can invoke actions
 *
 * Actions
 *  - `onFileInputChange`: action to handle files chosen through a file input
 *  - `onChooseFile`: if you use a different way
 *
 * Styling
 *  - This component's element has the `drop-zone` class
 *  - While the user is holding dragged files over this component, it
 *    has the `drop-zone-ready` class
 *
 * {{#file-chooser files=fileList as |component|}}
 *     {{input type='file' 
 *         change=(action 'onFileInputChange' target=component)}}
 * {{/file-chooser}}
 */

export default Ember.Component.extend({
    layout,
    classNames: ['drop-zone'],
    classNameBindings: ['dropZoneReady'],
    dropZoneReady: false,

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
        let callback = this.get('onChoose');
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            let file = event.dataTransfer.files[i];
            let p = this._fileCheck(file);
            p.then(() => this.send('onChooseFile', file, callback));
            p.catch(() => this.set('errorMessage',
                `Cannot upload directories (${file.name})`));
        }
    },

    actions: {
        onFileInputChange(event) {
            for (let i = 0; i < event.target.files.length; i++) {
                let file = event.target.files[i];
                let callback = this.get('onChoose');
                this.send('onChooseFile', file, callback);
            }
        },

        onChooseFile(file, callback) {
            let files = this.get('files');
            if (typeof files === 'undefined') {
                this.set('files', Ember.A());
                files = this.get('files');
            }
            files.pushObject(file);

            if (callback) {
                callback(file);
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
