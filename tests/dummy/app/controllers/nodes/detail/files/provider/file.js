import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        reloadFiles() {
            this.transitionToRoute('nodes.detail.files.provider',
                this.get('node'), this.model.get('provider'));
        },
        addATag(tag) {
            var file = this.get('model');
            var currentTags = file.get('tags').slice(0);
            Ember.A(currentTags);
            currentTags.pushObject(tag);
            file.set('tags', currentTags);
            file.save();
        },
        removeATag(tag) {
            var node = this.get('model');
            var currentTags = node.get('tags').slice(0);
            currentTags.splice(currentTags.indexOf(tag), 1);
            node.set('tags', currentTags);
            node.save();
        }
    }
});
