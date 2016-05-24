import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        reloadFiles() {
            this.transitionToRoute('nodes.detail.files.provider',
                this.get('node'), this.model.get('provider'));
        }
    }
});
