import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model(params) {
        return this.store.findRecord('guid', params.guid).then(g => g.get('referent'));
    },
    renderTemplate(controller, model) {
        let kind = model.constructor.modelName;
        if (kind === 'node') {
            this.render('nodes.detail.index', {
                model: model
            });
        } else if (kind === 'user') {
            this.render('users.detail', {
                model: model
            });
        } else if (kind === 'file') {
            this.render('files.detail', {
                model: model
            });
        } else {
            // 404 page? This should be impossible
        }
    }
});
