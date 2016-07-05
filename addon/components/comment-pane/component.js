import Ember from 'ember';
import layout from './template';

/**
 * Display a list of comments, as well as a form to submit new comments.
 * See CommentableMixin for controller actions that can be used with this component.
 *
 * @method
 * @public
 * @param {Array} comments An array of comments to be displayed
 * @param {action} addComment
 * @param {action} editComment
 * @param {action} deleteComment
 * @param {action} restoreComment
 * @param {action} reportComment
 */
export default Ember.Component.extend({
    layout,
    comments: null
});
