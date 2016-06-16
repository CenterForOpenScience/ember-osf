import Ember from 'ember';

export default Ember.Controller.extend({
    prefileCheck(comp, drop, file) {
        var _this = this;
        $('.modal').modal();
        $('.modal').on('hidden.bs.modal', function (e) {
            comp.defineUrl = _this.get('nodeId') + '/osfstorage/poo.txt'; //file informations
            drop.processFile(file);
        })
    },
    actions: {
        createNode: function(title, description) {
            var node = this.store.createRecord('node', {
                title: title,
                category: 'project',
                description: description || null
            });
            node.save();
        }
    }
});
