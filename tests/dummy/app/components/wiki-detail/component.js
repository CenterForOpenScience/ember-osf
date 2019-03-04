import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    currentUser: Ember.inject.service('current-user'),

    layout,
    showContent: false,
    wikiContent: '',
    actions: {
        toggleContent: function() {
            Ember.run.once(this, function() {
                let url = this.get('wiki.links.download');
                this.get('currentUser').authenticatedAJAX({
                    method: 'GET',
                    url: url,
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(data => {
                    this.set('wikiContent', data);
                });
            });
            this.toggleProperty('showContent');
        }
    }
});
