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
 */
export default Ember.Component.extend({
    layout,
    newTag: null,
    tags: [],

    tagName : "input",
    type : "text",
    attributeBindings : [ "name", "type", "value", "id"],


    _initialize: Ember.on('didInsertElement', function () {
        Ember.run.scheduleOnce('afterRender', this, function() {
            this.$().tagsInput({'width': '100px'});
        });
    }),

    actions: {
        addATag(tag) {
            let res = this.attrs.addATag(tag);
            res.then(() => this.set('newTag', ''));
        },
        removeATag(tag) {
            this.sendAction('removeATag', tag);
        }
    }
});
