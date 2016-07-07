import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Allow the user to view and manage tags.
 * See TaggableMixin for controller actions that can be used with this component.
 *
 * For more information on configuration options, see documentation for [jquery-tags-input](https://github.com/xoxco/jQuery-Tags-Input).
 *
 * ```handlebars
 * {{tags-widget
 *   addATag=(action 'addATag')
 *   removeATag=(action 'removeATag')
 *   tags=model.tags}}
 * ```
 * @class tags-widget
 * @extends Ember.Component
 */
export default Ember.Component.extend({
    layout,

    /**
     * Whether the user is allowed to edit tags.
     * @property canEdit
     * @type {Boolean}
     */
    canEdit: true,  // TODO: Implement editing decision logic in the future
    tags: [],

    tagName: 'input',
    type: 'text',
    attributeBindings: ['name', 'type', 'value', 'id'],

    _initialize: Ember.on('didInsertElement', function () {
        Ember.run.scheduleOnce('afterRender', this, function() {
            this.$().tagsInput({
                width: '100%',
                interactive: this.get('canEdit'),
                maxChars: 128,
                onAddTag: (tag) => {
                    this.send('addATag', tag);
                },
                onRemoveTag: (tag) => {
                    this.send('removeATag', tag);
                }
            });
            // Populate the widget with the default tags passed in
            let tags = this.get('tags');
            this.$().importTags(tags.join(', '));
        });
    }),

    actions: {
        addATag(tag) {
            this.attrs.addATag(tag);
        },
        removeATag(tag) {
            // Don't try to delete a blank tag (would result in a server error)
            if (!tag) {
                return false;
            }
            this.sendAction('removeATag', tag);
        }
    }
});
