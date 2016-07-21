import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display a list of comments, as well as a form to submit new comments.
 * See CommentableMixin for controller actions that can be used with this component.
 *
 * Sample usage:
 * ```handlebars
 * {{comment-pane
 *   comments=comments
 *   title=model.title
 *   resource=model
 *   addComment=(action 'addComment')
 *   editComment=(action 'editComment')
 *   deleteComment=(action 'deleteComment')
 *   restoreComment=(action 'restoreComment')
 *   reportComment=(action 'reportComment')}}
 * ```
 * @class comment-pane
 * @param {Comment[]} comments An array of comments to be displayed
 * @param {String} title The title of the resource
 * @param {DS.Model} resource The parent resource that owns the comment
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
