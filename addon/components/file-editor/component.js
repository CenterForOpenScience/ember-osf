import Ember from 'ember';
import layout from './template';
import ace from 'ember-ace';

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

    actions: {
        revertText() {
            const editor = ace.edit(document.querySelector('[data-ember-ace]'));
            editor.getSession().setValue(this.get('fileText'));
        },
        saveText() {
            const editor = ace.edit(document.querySelector('[data-ember-ace]'));
            this.sendAction('save', editor.getSession().getValue());
        },
    },
});