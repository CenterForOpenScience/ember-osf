import Ember from 'ember';
import layout from './template';
import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';


export default Ember.Component.extend({
    layout,
    showContent: false,
    wikiContent: '',
    actions: {
        toggleContent: function(){
            Ember.run.once(this, function() {
                let url = this.get('wiki.links.download');
                authenticatedAJAX({
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
