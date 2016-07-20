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
 *   resource=node
 *   addComment=attrs.addComment
 *   editComment=attrs.editComment
 *   deleteComment=attrs.deleteComment
 *   restoreComment=attrs.restoreComment
 *   reportComment=attrs.reportComment}}
 * ```
 * @class comment-detail
 * @param {DS.Model} comment The comment to display
 * @param {DS.Model} resource The parent resource that owns the comment
 * @param {action} addComment
 * @param {action} editComment
 * @param {action} deleteComment
 * @param {action} restoreComment
 * @param {action} reportComment
 */
export default Ember.Component.extend({
    layout,
    /**
     * The comment to display
     * @property comment
     */
    comment: null,
    /**
     * The parent resource to which comments are attached.
     * @property resource
     * @type Node|File|Wiki|Comment
     */
    resource: null, // TODO: Track whether the node is being viewed in "anonymous" mode and change how authors are displayed

    // Store information about direct replies to this comment
    _replies: Ember.A(),

    // Conditionals that control display of template sections
    replyMode: false,
    editMode: false,
    deleteMode: false,
    reportMode: false,

    showChildren: false,

    // Conditionals that track actions in progress

    // TODO: Perhaps these fields should be defined on the comment?
    isDeletedAbuse: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return this.get('comment.deleted') && this.get('comment.isAbuse');
    }),
    isDeletedNotAbuse: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return this.get('comment.deleted') && !this.get('comment.isAbuse');
    }),
    isAbuseNotDeleted: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return !this.get('comment.deleted') && this.get('comment.isAbuse');
    }),
    // TODO: Rename this variable after parity with source is achieved
    // Whether to show comment text. Source template called "isVisible", which has special meaning in ember....!
    isShowingContent: Ember.computed('comment.deleted', 'comment.isAbuse', function() {
        return !this.get('comment.deleted') && !this.get('comment.isAbuse');
    }),

    canComment: Ember.computed.alias('resource.currentUserCanComment'),
    canReport: Ember.computed('canComment', 'comment.canEdit', function() {
        return this.get('canComment') && !this.get('comment.canEdit');
    }),

    actions: {
        toggleChildren() {
            // TODO: Implement toggling of children widgets
            if (!this.get('showChildren')) {
                this.send('fetchChildren');
            }
            // TODO: If fetch is in progress, should there be a loading indicator of some sort?
            this.toggleProperty('showChildren');
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
        toggleReportMode() {
            // Show buttons relevant to reporting a comment
            this.toggleProperty('reportMode');
        },

        fetchChildren() {
            // Fetch child comments (replies)

            // TODO:
            // 1. track what page of results to fetch
            // 2. Handle additional query params, embeds, viewonly behaviors, related counts etc
            // 3. Ensure that children are rendered.
            // 4. Ensure that when a reply is added, it's added to the list of known children.
        },

        replyComment(text) {
            // Reply to the comment owned by this component
            return this.attrs.addComment(text, this.get('comment'))
                .then((res) => {
                    this.send('toggleReplyMode');
                    return res;
                });
        },
        editComment(text) {
            // TODO: Max call stack size exceeded is never a good error...
            // Edit the comment owned by this component. Don't return anything, as form should disappear when editing is done.
            this.attrs.editComment(text, this.get('comment'))
                .then((res) => this.set('toggleEditMode'));
        }
    }
});
