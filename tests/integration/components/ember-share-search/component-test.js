import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('discover-page', 'Integration | Component | discover page', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    Ember.run(() => {
        this.set('shareSearchUrl', 'https://staging-share.osf.io/api/v2/search/creativeworks/_search');
        this.set('facets', [{
            key: 'sources', title: 'Sources', component: 'search-facet-locked', locked_items: ['PubMedCentral']
        }]);
        this.set('searchPlaceholder', 'Test Placeholder');

        this.render(hbs`{{discover-page
            shareSearchUrl=shareSearchUrl
            facets=facets
            searchPlaceholder=searchPlaceholder
        
        }}`);

        let placeholder = this.$('div.search-header').children()[1].firstElementChild.firstElementChild.firstElementChild.placeholder;

        assert.equal(placeholder, 'Test Placeholder');

    });


});
