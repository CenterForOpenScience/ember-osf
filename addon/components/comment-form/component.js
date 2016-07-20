import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */



const Validations = buildValidations({
    _commentText: validator('length', {
        max: 500,
        message: 'Comment should not be more than 500 characters'
    })
});

/**
 * Allow users to add comments to a page.
 *
 * This component is typically used as part of the `comment-pane` component; see that component for further information.
 * Sample usage:
 * ```handlebars
 * {{comment-form addComment=attrs.addComment}}
 * ```
 *
 * @class comment-form
 * @param {action} addComment The action to fire when adding a new comment to the discussion. Returns a promise.
 */
export default Ember.Component.extend(Validations, {
    layout,
    _commentText: null,
    errorMessage: null,
    submitInProgress: false,

    actions: {
        /**
         * Call a passed-in closure action to handle submitting a comment. Reset the form if save succeeds.
         * @method addComment
         * @param {String} text The text of the comment to create
         */
        addComment(text) {
            // TODO: Rename to submitComment (edit or save as appropriate)
            if (!text) {
                this.set('errorMessage', 'Please enter a comment');
                return;
            }
            this.set('submitInProgress', true);
            let res = this.attrs.addComment(text);
            res.then(() => this.send('resetForm'));
        },
        cancelComment() {
            this.send('resetForm');
        },
        resetForm() {
            this.set('_commentText', '');
            this.set('submitInProgress', false);
            this.set('errorMessage', '');
        }
    }
});
