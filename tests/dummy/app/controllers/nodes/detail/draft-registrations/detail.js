import Ember from 'ember';
import RegistrationActionsMixin from 'ember-osf/mixins/registration-actions';

export default Ember.Controller.extend(RegistrationActionsMixin, {
    editedMetadata: {},
    embargoSelected: false,
    registrationChoice: 'immediate',
    liftEmbargo: '',
    actions: {
        regForm() {
            this.toggleProperty('formDisplayed');
        },
        /** Builds new registration metadata in format that server is expecting.  Different
            schemas will have different levels of nesting.
         **/
        buildForm(target) {
            let response = '';
            let question = target.name;
            if (question.indexOf(':') !== -1) {
                var pieces = question.split(':');
                question = pieces[0];
                var subquestion = pieces[1];
                let subsubquestion = '';
                if (pieces.length === 3) {
                    subsubquestion = pieces[2];
                    response = { value: { [subsubquestion]: { value: target.value } } };
                } else {
                    response = { value: target.value };
                }
                if (this.editedMetadata[question]) {
                    if (this.editedMetadata[question].value[subquestion]) {
                        if (pieces.length === 3) {
                            this.editedMetadata[question].value[subquestion].value[subsubquestion] = { value: target.value };
                        }
                    } else {
                        this.editedMetadata[question].value[subquestion] = response;
                    }
                } else {
                    this.editedMetadata[question] = { value: { [subquestion]: response } };
                }

            } else {
                this.editedMetadata[question] = {
                    value: target.value
                };
            }
        },
        changeRegistrationChoice(newChoice) {
            this.toggleProperty('embargoSelected');
            this.set('registrationChoice', newChoice);
        },
        changeEmbargoEndDate(newDate) {
            this.set('liftEmbargo', newDate + 'T12:00:00');
        },
    }
});
