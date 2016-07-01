import Ember from 'ember';
import RegistrationActionsMixin from 'ember-osf/mixins/registration-actions';

export default Ember.Controller.extend(RegistrationActionsMixin, {
    editedMetadata: {},
    embargoSelected: false,
    registrationChoice: 'immediate',
    liftEmbargo: '',
    actions: {
        /**
        * Toggle whether registration form is displayed.
        *
        * @method regForm
        */
        regForm() {
            this.toggleProperty('formDisplayed');
        },
        /**
        * Build new registration metadata in format that server is expecting.  Different
        * schemas will have different levels of nesting.  Each time a question is
        * answered on a draft registration, the response will be added to the editedMetadata object.
        *
        * @method buildForm
        * @param {Object} target Response to draft question
        */
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
        /**
        * Update registrationChoice (either "immediate" or "embargo") and toggles whether
        * embargo end date is displayed in the UI
        *
        * @method changeRegistrationChoice
        * @param {String} newChoice New registration choice (either "immediate"/"embargo")
        */
        changeRegistrationChoice(newChoice) {
            this.toggleProperty('embargoSelected');
            this.set('registrationChoice', newChoice);
        },
        /**
        * Update embargoEndDate.  Takes calendar date and appends time info onto the end,
        * in the format that the APIv2 is expecting
        *
        * @method changeEmbargoEndDate
        * @param {Date} newDate Date to lift the embargo
        */
        changeEmbargoEndDate(newDate) {
            this.set('liftEmbargo', newDate + 'T12:00:00');
        },
    }
});
