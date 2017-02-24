import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

export default Ember.Component.extend({
    layout,
    host: config.OSF.url,
    currentService: "HOME",
    osfServices: Ember.computed('host', function() {
        return [
            {
                name: "HOME",
                url: `${this.get('host')}`,
                navbarLinks: [
                    {
                        name: 'My Projects',
                    },
                    {
                        name: 'Search'
                    }
                ]
            },
            {
                name: "PREPRINTS",
                url: `${this.get('host')}preprints/`,
                navbarLinks: [
                    {
                        name: 'Add a preprint',
                    },
                    {
                        name: 'Search'
                    },
                    {
                        name: 'Support'
                    }
                ]
            },
            {
                name: "REGISTRIES",
                url: `${this.get('host')}registries/`,
                navbarLinks: [
                    {
                        name: 'Search'
                    }
                ]
            },
            {
                name: "MEETINGS",
                url: `${this.get('host')}meetings/`,
                navbarLinks: [
                    {
                        name: 'Search'
                    }
                ]
            }
        ];
    }),
    actions: {
        switchService(serviceName) {
            this.set('currentService', serviceName);
        }
    }

});
