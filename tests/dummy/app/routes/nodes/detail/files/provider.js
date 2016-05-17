import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        var fileProviders = this.modelFor('nodes/detail/files');
        return fileProviders.findBy('provider', params.provider);
    },
});
