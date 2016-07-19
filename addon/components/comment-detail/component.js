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
    replyMode: false,
    editMode: false,
    deleteMode: false,
    reportMode: false,
    
    showChildren: false,

    // Conditionals that track actions in progress


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
    canReport: Ember.computed('node.currentUserCanComment', 'comment.canEdit', function() {
        return this.get('node.currentUserCanComment') && !this.get('comment.canEdit');
    }),

    actions: {
        toggleChildren() {
            // TODO: Implement toggling of children widgets
            this.toggleProperty('showChildren');
            // TODO: Fetch children as needed
        },
        toggleEditMode() {
            // Allow editing of a pre-existing comment
            this.toggleProperty('editMode');
        },
        toggleReplyMode() {
            // Allow new replies to a parent comment
            this.toggleProperty('replyMode');
        },
        toggleDeleteMode() {
            // Show buttons relevant to comment deletion
            this.toggleProperty('deleteMode');
        },
        reportMode() {
            // Show buttons relevant to reporting a comment
            this.toggleProperty('reportMode');
        }
    }
});
