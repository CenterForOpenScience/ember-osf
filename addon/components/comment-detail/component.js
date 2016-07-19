import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display information about an individual comment, including controls to edit, delete, and report.
 * This component is typically used as part of the `comment-pane` component; see that component for further information.
 *
 * Sample usage:
 * ```handlebars
 * {{comment-detail
 *   comment=comment
 *   editComment=attrs.editComment
 *   deleteComment=attrs.deleteComment
 *   restoreComment=attrs.restoreComment
 *   reportComment=attrs.reportComment}}
 * ```
 * @class comment-detail
 * @param {DS.Model} comment The comment to display
 * @param {action} editComment
 * @param {action} deleteComment
 * @param {action} restoreComment
 * @param {action} reportComment
 */
export default Ember.Component.extend({
    layout,
    comment: null,
    node: null, // TODO: Track whether the node is being viewed in "anonymous" mode and change how authors are displayed

    // Conditionals that control display of template sections
    editMode: false,
    showChildren: false,

    isDeletedAbuse: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return this.get('comment.deleted') && this.get('comment.isAbuse');
    }),
    isDeletedNotAbuse: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return this.get('comment.deleted') && !this.get('comment.isAbuse');
    }),
    isAbuseNotDeleted: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return !this.get('comment.deleted') && this.get('comment.isAbuse');
    }),

    isVisible: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return !this.get('comment.deleted') && !this.get('comment.isAbuse');
    }),

    actions: {
        toggleChildren() {
            // TODO: Implement toggling of children widgets
            this.toggleProperty('showChildren');
            // TODO: Fetch children as needed
        }
    }
});
