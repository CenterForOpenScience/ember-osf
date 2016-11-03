import Ember from 'ember';
import OsfTokenLoginControllerMixin from 'ember-osf/mixins/osf-token-login-controller';

export default Ember.Controller.extend(OsfTokenLoginControllerMixin, {
    _url: null,
    dropzoneOptions: {
        method: 'PUT'
    },
    actions: {
        buildUrl() {
            return this.get('_url');
        },
        preUpload(comp, drop, file) {
            this.set('openModal', true);
            this.set('latestFileName', file.name);
            var promise = new Ember.RSVP.Promise(resolve => {
                this.set('resolve', resolve);
            });
            return promise;
        }
    }
});
