import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        draftForm() {
            this.toggleProperty('formDisplayed');
        }
    }
});
