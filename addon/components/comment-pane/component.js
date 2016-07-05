import Ember from 'ember';
import layout from './template';

/**
 * Display a list of comments, as well as a form to submit new comments. 
 * See CommentableMixin for controller actions that can be used with this component.
 *
 * @method
 * @public
 * @param {Array} comments An array of comments to be displayed
 * @param {action} addComment The action to fire when adding a new comment to the discussion. Returns a promise.
 * @param {action} editComment The action to fire when editing a comment. Returns a promise.
 * @param {action} deleteComment The action to fire when deleting a comment. Returns a promise.
 * @param {action} restoreComment The action to fire when the original comment author un-deletes a comment. Returns a promise.
 * @param {action} reportComment The action to fire to report a comment that violates terms of service. Returns a promise.
 */
export default Ember.Component.extend({
    layout,
    comments: null
});
