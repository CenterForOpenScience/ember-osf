import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

export default Ember.Component.extend( {
    layout,
    session: Ember.inject.service(),
    host: config.OSF.url,
    currentService: "HOME",
    osfServices: Ember.computed('currentService', function() {
        return [
            {
                name: "HOME",
                url: `${this.get('host')}`,
            },
            {
                name: "PREPRINTS",
                url: `${this.get('host')}preprints/`,
            },
            {
                name: "REGISTRIES",
                url: `${this.get('host')}registries/`,
            },
            {
                name: "MEETINGS",
                url: `${this.get('host')}meetings/`,
            }
        ];
    }),
    actions: {
        switchService(serviceName) {
            this.set('currentService', serviceName);
        }
    }

});
