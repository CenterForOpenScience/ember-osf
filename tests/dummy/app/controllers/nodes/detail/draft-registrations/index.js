import Ember from 'ember';
import RegistrationActionsMixin from 'ember-osf/mixins/registration-actions';

export default Ember.Controller.extend(RegistrationActionsMixin, {
    actions: {
        /**
        * Toggles whether draft form is displayed.
        *
        * @method draftForm
        */
        draftForm() {
            this.toggleProperty('formDisplayed');
        }
    }
});
