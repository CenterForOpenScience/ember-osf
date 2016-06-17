import Ember from 'ember';

export default Ember.Controller.extend({
    _url: null,
    openModal: false,
    actions: {
        prefileCheck(comp, drop, file) {
            this.set('openModal', true);
            return new Ember.RSVP.Promise(resolve => {
                $('.modal').on('hidden.bs.modal', () => {
                    this.set('_url', this.get('nodeId'));
                    resolve();
                })
            });
        },
        createNode: function(title, description) {
            var node = this.store.createRecord('node', {
                title: title,
                category: 'project',
                description: description || null
            });
            node.save();
        },
        defineUrl () {
            return this.get('_url');
        }
    }
});
