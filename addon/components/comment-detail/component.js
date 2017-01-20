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
     * @type Comment|File|Node|Preprint|Wiki
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
        // TODO: Implement this in EOSF-76, a separate ticket. Until then, hardcode return value to disable buttons.
        //return this.get('canComment') && !this.get('comment.canEdit');
        return false;
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
            // TODO: We need a mechanism to indicate that replies failed to load for that user. (explain why button didn't bring a reply box it request fails)
            let replyMode = this.get('replyMode');
            if (!this.get('comment.hasChildren')) {
                this.toggleProperty('replyMode');
            } else if (replyMode) {
                this.set('replyMode', false);
            } else {
                // If the comment has children, do not show the reply box until child comments are loaded.
                // This makes sense for the UI, but it also addresses issue where the adapter would fail to track dirty
                //   state for new comments on a relationship that had not yet loaded
                let children = this.get('comment.replies');
                // TODO: Improve error reporting UI here; throw error for now
                children.then(() => {
                    this.set('showChildren', true);
                    this.set('replyMode', true);
                }).catch(() => {
                    throw new Ember.Error('Failed to load comments');
                });
            }
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
            // TODO: For now we will just use comment.replies, which is limited in number of results available

        },
        replyComment(text) {
            // Reply to the comment owned by this component
            let comment = this.get('comment');
            return this.attrs.addComment(text, this.get('comment'))
                .then((res) => {
                    this.send('toggleReplyMode');
                    // When a new comment is filed, we don't refetch data about the parent- and therefore it doesn't realize that it now has replies.
                    // Since this is a read-only field, we can't save the record like this...
                    // Hack: when a comment is saved, tell the comment it has children, but don't save
                    // FIXME: leaving the store in a dirty state is something we'll probably regret- revisit
                    comment.set('hasChildren', true);

                    // Always show children when request succeeds
                    this.set('showChildren', true);
                    return res;
                });
        },
        editComment(text) {
            // Edit the comment owned by this component.
            return this.attrs.editComment(text, this.get('comment'))
                .then(() => this.send('toggleEditMode'));
        }
    }
});
