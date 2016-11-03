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
 *   addATag=(action 'addATag' model)
 *   removeATag=(action 'removeATag' model)
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
        });
    }),

    didRender() {
        // Rerender the list of tags whenever the node model changes. Useful if node.tags is not defined when page loads.
        // Provide a default value in case tags weren't defined when component first rendered
        let tags = this.get('tags') || [];
        // Reset & replace existing tag list with new items
        this.$().importTags(tags.join(', '));
    },

    actions: {
        addATag(tag) {
            const splitTags = tag
                .split(/[,]+/)
                .map(item => item.trim());

            // Calls a curried closure action which was provided the model
            for (let splitTag of splitTags)
                this.attrs.addATag(splitTag);
        },
        removeATag(tag) {
            // Don't try to delete a blank tag (would result in a server error)
            if (!tag) {
                return false;
            }
            this.attrs.removeATag(tag);
        }
    }
});
