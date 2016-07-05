import Ember from 'ember';
import layout from './template';

/**
 * Display information about an individual comment, including controls to edit, delete, and report.
 *
 * This component is typically used as part of the `comment-pane` component; see that component for further information.
 *
 * @method comment-detail
 * @public
 * @param {DS.Model} comment The comment to display
 * @param {action} editComment The action to fire when editing a comment. Returns a promise.
 * @param {action} deleteComment The action to fire when deleting a comment. Returns a promise.
 * @param {action} restoreComment The action to fire when the original comment author un-deletes a comment. Returns a promise.
 * @param {action} reportComment The action to fire to report a comment that violates terms of service. Returns a promise.
 */
export default Ember.Component.extend({
    layout,
    comment: null
});


// TODO: Crosslink
