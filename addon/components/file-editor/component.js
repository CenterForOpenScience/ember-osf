import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Edit the chosen file
 *
 * Sample usage:
 * ```handlebars
 * {{file-editor
     fileText=fileText
     save='save'}}
 * ```
 * @class file-editor
 */

export default Ember.Component.extend({
    layout,
    fileText: '',
    unsavedText: '',

    newText: Ember.computed('fileText', function() {
        return String(this.get('fileText'));
    }),

    actions: {
        valueUpdated(newValue) {
            this.set('unsavedText', newValue);
        },
        revertText() {
            const fileText = this.get('fileText');
            this.set('fileText', '');
            Ember.run.next(() => this.set('fileText', fileText));
        },
        saveText() {
            this.attrs.save(this.get('unsavedText'));
        },
    },
});
