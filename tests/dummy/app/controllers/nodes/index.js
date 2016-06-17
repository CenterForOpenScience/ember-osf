import Ember from 'ember';

export default Ember.Controller.extend({
    _url: null,
    actions: {
        prefileCheck(comp, drop, file) {
            var _this = this;
            $('.modal').modal();
            var promise =  new Ember.RSVP.Promise(resolve => {
                $('.modal').on('hidden.bs.modal', () => {
                    this.set('_url', '/osfstorage/poo.txt');
                    resolve();
                })
            });
            return promise
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
