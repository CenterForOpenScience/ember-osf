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
 * Allow users to add comments to a page, or edit an existing comment if initialText is provided..
 *
 * This component is typically used as part of the `comment-pane` component; see that component for further information.
 * Sample usage:
 * ```handlebars
 * {{comment-form
 *   submitComment=attrs.addComment
 *   showButtons=false}}
 * ```
 *
 * @class comment-form
 * @param {action} submitComment The action to fire when adding a new comment to the discussion. Returns a promise.
 */
export default Ember.Component.extend(Validations, {
    layout,
    /**
     * The default text for the comment. If passed in, this component acts as an edit widget instead of creation.
     * @property initialText
     * @type String|null
     */
    initialText: null,

    /**
     * Control whether buttons should be displayed by default
     * @property showButtons
     * @type boolean
     */

    // Track internal state
    _commentText: Ember.computed.oneWay('initialText'),
    editMode: Ember.computed.bool('initialText'),
    errorMessage: null,
    submitInProgress: false,

    actions: {
        /**
         * Call a passed-in closure action to handle submitting a comment. Reset the form if save succeeds.
         * @method submitComment
         * @param {String} text The text of the comment to create
         */
        submitComment(text) {
            if (!text) {
                this.set('errorMessage', 'Please enter a comment');
                return;
            }
            this.set('submitInProgress', true);

            let res = this.attrs.submitComment(text);
            // If adding a comment, clear the box for another comment
            res.then(() => this.send('resetForm'))
                .catch(() => this.set('errorMessage', 'Could not submit comment'));

        },
        cancelComment() {
            // User can pass in their own cancelComment function, eg to exit reply mode
            if (this.attrs.cancelComment) {
                this.attrs.cancelComment();
            } else {
                this.send('resetForm');
            }
        },
        resetForm() {
            this.set('_commentText', '');
            this.set('submitInProgress', false);
            this.set('errorMessage', '');
        }
    }
});
