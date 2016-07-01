import Ember from 'ember';
import RegistrationActionsMixin from 'ember-osf/mixins/registration-actions';

export default Ember.Controller.extend(RegistrationActionsMixin, {
    actions: {
        draftForm() {
            this.toggleProperty('formDisplayed');
        }
    }
});
