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
        registrationChoiceChange() {
            this.toggleProperty('embargoSelected');
        },
        buildForm(target) {
            let response = '';
            let question = target.name;
            if (question.indexOf(':') !== -1) {
                var pieces = question.split(':');
                if (pieces.length === 3) {
                    response = { value: {
                        [pieces[2]]: {
                            value: target.value
                        }
                    } };
                } else {
                    response = { value: target.value };
                }
                if (this.editedMetadata[pieces[0]]) {
                    if (this.editedMetadata[pieces[0]].value[pieces[1]]) {
                        if (pieces.length === 3) {
                            this.editedMetadata[pieces[0]].value[pieces[1]].value[pieces[2]] = { value: target.value };
                        }
                    } else {
                        this.editedMetadata[pieces[0]].value[pieces[1]] = response;
                    }
                } else {
                    this.editedMetadata[pieces[0]] = { value: { [pieces[1]]: response } };
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
