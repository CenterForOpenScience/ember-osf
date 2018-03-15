import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Allow users to add comments to a page.
 *
 * This component is typically used as part of the `comment-pane` component; see that component for further information.
 * Sample usage:
 * ```handlebars
 * {{comment-form addComment=attrs.addComment}}
 * ```
 *
 * @class comment-form
 * @param {action} addComment The action to fire when adding a new comment to the discussion. Returns a promise.
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    _commentText: null,

    actions: {
        /**
         * Call a passed-in closure action to handle submitting a comment. Reset the form if save succeeds.
         * @method addComment
         * @param {String} text The text of the comment to create
         */
        addComment(text) {
            let res = this.attrs.addComment(text);
            res.then(() => this.set('_commentText', ''));
        }
    }
});
