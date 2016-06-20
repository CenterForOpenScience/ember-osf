import Ember from 'ember';

export default Ember.Controller.extend({
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
            let question = target.name;
            if (question.indexOf(':') !== -1) {
                var pieces = question.split(':');
                this.editedMetadata[pieces[0]] = {
                    value: {
                        [pieces[1]]: {
                            value: target.value
                        }
                    }
                };
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
