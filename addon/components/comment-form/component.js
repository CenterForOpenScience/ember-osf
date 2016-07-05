import Ember from 'ember';
import layout from './template';

/**
 * Allow users to add comments to a page.
 *
 * This component is typically used as part of the `comment-pane` component; see that component for further information.
 *
 * @method
 * @public
 * @param {action} addComment The action to fire when adding a new comment to the discussion. Returns a promise.
 */
export default Ember.Component.extend({
    layout,
    _commentText: null,

    actions: {
        addComment(text) {
            // Call the passed-in closure action. Reset form only after save succeeds.
            let res = this.attrs.addComment(text);
            res.then(() => this.set('_commentText', ''));
        }
    }
});
