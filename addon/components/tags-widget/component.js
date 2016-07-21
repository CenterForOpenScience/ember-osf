import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Allow the user to view and manage tags.
 * See TaggableMixin for controller actions that can be used with this component.
 * Pattern is a regular expression to validate input against.
 *
 * ```handlebars
 * {{tags-widget
 *   addTag=(action 'addTag')
 *   removeTag=(action 'removeTag')
 *   tags=model.tags
 *   pattern='^[\\w-]+$'}}
 * ```
 * @class tags-widget
 * @extends Ember.Component
 */
export default Ember.Component.extend({
    layout,
    classNameBindings: ['invalid:has-error'],
    pattern: /^.{1,128}$/,
    tags: [],
    value: '',
    didReceiveAttrs() {
        this._super(...arguments);
        // Initialize attributes
        const tags = this.get('tags');
        const pattern = this.get('pattern');
        if (!Ember.isArray(tags)) {
            this.set('tags', tags ? [tags] : []);
        }
        if (typeof pattern === 'string') {
            this.set('pattern', new RegExp(pattern));
        }
    },
    keyDown(evt) {
        const value = this.get('value');
        switch (evt.keyCode) {
            case 13: // Enter
                // Add tag to list after validating
                const text = Ember.$.trim(value).replace(/\s{2,}/g, ' ');
                if (text && this.get('pattern').test(text) && !this.get('tags').find(tag => tag === text)) {
                    this.send('addTag', text);
                }
                break;
            case 8: // Backspace
                // Pop last tag back into input
                if (!value && this.get('tags').length) {
                    const tag = this.get('tags').popObject();
                    this.set('value', `${tag} `);
                    this.sendAction('removeTag', tag);
                }
                break;
        }
    },
    keyUp() {
        // Manual form validation
        const text = Ember.$.trim(this.get('value')).replace(/\s{2,}/g, ' ');
        this.set('invalid', text && !this.get('pattern').test(text));
    },
    click() {
        this.set('focused', true);
        this.$('input').focus();
    },
    // Bubbles from input
    focusOut() {
        this.set('focused', false);
    },
    // Bubbles from input, handles alternate methods of focusing on input
    focusIn() {
        this.set('focused', true);
    },
    actions: {
        addTag(tag) {
            this.get('tags').pushObject(tag);
            this.set('value', '');
            this.sendAction('addTag', tag);
        },
        removeAt(index) {
            const tag = this.get('tags').objectAt(index);
            this.get('tags').removeAt(index);
            this.sendAction('removeTag', tag);
        }
    }
});
