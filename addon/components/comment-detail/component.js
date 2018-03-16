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
    i18n: Ember.inject.service(),
    comment: null
});
