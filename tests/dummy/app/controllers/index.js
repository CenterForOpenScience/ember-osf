import Ember from 'ember';
import OsfLoginControllerMixin from 'ember-osf/mixins/osf-login-controller';

export default Ember.Controller.extend(OsfLoginControllerMixin, {
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
