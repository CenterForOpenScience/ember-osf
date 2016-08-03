import Ember from 'ember';
import CommentableMixin from 'ember-osf/mixins/commentable';
import TaggableMixin from 'ember-osf/mixins/taggable-mixin';
import NodeActionsMixin from 'ember-osf/mixins/node-actions';

export default Ember.Controller.extend(CommentableMixin, TaggableMixin, NodeActionsMixin, {
    toast: Ember.inject.service(),
    propertiesVisible: false,
    isSaving: false,
    canEdit: Ember.computed('isAdmin', 'isRegistration', function() {
        return this.get('isAdmin') && !(this.get('model').get('registration'));
    }),
    isAdmin: Ember.computed(function() {
        return this.get('model').get('currentUserPermissions').indexOf('admin') >= 0;
    }),
    searchResults: [],
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
        },
        findContributors(query) {
            var _this = this;
            _this.store.query('user', { filter: { full_name: query } }).then(function(contributors) {
                _this.set('searchResults', contributors);
                return contributors;
            });
        }
    }
});
