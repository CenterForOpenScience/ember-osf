import Ember from 'ember';
import TaggableMixin from 'ember-osf/mixins/taggable-mixin';
import NodeActionsMixin from 'ember-osf/mixins/node-actions';

export default Ember.Controller.extend(TaggableMixin, NodeActionsMixin, {
    toast: Ember.inject.service(),
    propertiesVisible: false,
    isSaving: false,
    actions: {
        toggleEditNode() {
            this.toggleProperty('propertiesVisible');
        },
        updateNode() {
	    this.set('isSaving', true);
            return this._super(...arguments)
		.then(() => {
		    this.set('isSaving', false);
                    this.get('toast').success('Node updated successfully');
		})
		.catch(() => this.set('isSaving', false));
        }
    }
});

