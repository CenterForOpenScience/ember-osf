import Ember from 'ember';
import CommentableMixin from 'ember-osf/mixins/commentable';
import TaggableMixin from 'ember-osf/mixins/taggable-mixin';
import NodeActionsMixin from 'ember-osf/mixins/node-actions';

export default Ember.Controller.extend(CommentableMixin, TaggableMixin, NodeActionsMixin, {
    toast: Ember.inject.service(),
    propertiesVisible: false,
    isSaving: false,
    licenseToggle: false,
    serializedLicense: Ember.computed('model.license', function() {
        let license = this.get('model.license');
        if (!license) {
            return;
        }
        return {
            licenseType: license.get('nodeLicense'),
            year: license.get('year'),
            copyrightHolders: license.get('copyrightHolders')
        };
    }),
    actions: {
        toggleEditNode() {
            this.toggleProperty('propertiesVisible');
        },
        toggleLicense() {
            this.toggleProperty('licenseToggle');
        },
        editLicense() {
            var p = ...arguments;
            debugger;
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
