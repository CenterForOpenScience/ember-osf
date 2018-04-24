import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * This component lets the user choose a list of files from their computer, by
 * drag-and-drop, a file browser, or whatever method the developer wants.
 *
 * Exposed to parent context (bindable attributes)
 *  - `files`: mutable list of chosen File objects
 *  - `multiple`: boolean (default `true`), when `false`, only keeps the most
 *          recently chosen File in the list
 *  - `onChoose`: callback function called each time a file is added, with the
 *          new File object as the only argument
 *
 * Exposed to block context
 *  - `this`: the component object itself, so the block can invoke actions
 *      example:
 *      ```handlebars
 *          {{#file-chooser files=fileList as |component|}}
 *              {{input type='file'
 *                  change=(action 'onFileInputChange' target=component)}}
 *          {{/file-chooser}}
 *      ```
 *
 * Actions
 *  - `onFileInputChange`: handle the `change` event on a file input
 *  - `onChooseFile`: add a file to the chosen list
 *
 * Styling
 *  - This component's element has the `drop-zone` class
 *  - While the user is holding dragged files over this component, it
 *    has the `drop-zone-ready` class
 *
 * @class file-chooser component
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    classNames: ['drop-zone'],
    classNameBindings: ['dropZoneReady'],
    dropZoneReady: false,
    multiple: true,

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
            this._chooseIfFile(file);
        }
    },

    actions: {
        onFileInputChange(event) {
            for (let i = 0; i < event.target.files.length; i++) {
                let file = event.target.files[i];
                this.send('onChooseFile', file);
            }
        },

        onChooseFile(file) {
            let files = this.get('files');
            if (typeof files === 'undefined') {
                this.set('files', Ember.A());
                files = this.get('files');
            }
            if (this.get('multiple')) {
                files.pushObject(file);
            } else {
                this.set('files', Ember.A([file]));
            }

            let callback = this.get('onChoose');
            if (callback) {
                callback(file);
            }
        }
    },

    _chooseIfFile(file) {
        // HACK: There's not a cross-browser way to see the contents of
        // dragged-and-dropped directories, but there's also not a good way to
        // tell whether a given File object is a directory. Hence, this:
        let p = new Ember.RSVP.Promise(function(resolve, reject) {
            let reader = new FileReader();
            reader.onload = () => resolve(); // it's a file
            reader.onerror = () => reject(); // it's a directory or something
            reader.readAsText(file.slice(0, 5));
        });
        p.then(() => this.send('onChooseFile', file));
        p.catch(() => this.set('errorMessage',
            `Cannot upload directories (${file.name})`));
    }
});
