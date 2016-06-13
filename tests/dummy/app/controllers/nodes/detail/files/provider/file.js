import Ember from 'ember';

import CommentableMixin from 'ember-osf/mixins/commentable';

export default Ember.Controller.extend(CommentableMixin, {
    reloadFiles() {
        this.transitionToRoute('nodes.detail.files.provider',
			       this.get('node'), this.model.get('provider'));
    }
});
