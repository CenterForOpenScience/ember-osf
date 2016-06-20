import Ember from 'ember';

export default Ember.Controller.extend({
    editedMetadata: {},
    actions: {
        draftForm() {
            this.toggleProperty('formDisplayed');
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
    }
});
