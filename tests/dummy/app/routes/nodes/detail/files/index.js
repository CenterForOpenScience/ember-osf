import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import GuidRouteMaskMixin from 'ember-osf/mixins/guid-route-mask';

export default Ember.Route.extend(AuthenticatedRouteMixin, GuidRouteMaskMixin, {
    setupController(controller, model) {
        this._super(controller, model);
        let node = this.modelFor('nodes.detail');
        controller.set('node', node);
    }
});
