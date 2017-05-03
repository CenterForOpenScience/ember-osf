import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('discover-page', 'Integration | Component | discover page', {
  integration: true
});

skip(() => {
    test('it renders', function(assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
        Ember.run.later(() => {
            this.set('facets', [{
                key: 'sources', title: 'Sources', component: 'search-facet-locked', locked_items: ['PubMedCentral']
            }]);
            this.set('searchPlaceholder', 'Test Placeholder');

            this.render(hbs`{{discover-page
                facets=facets
                searchPlaceholder=searchPlaceholder
            
            }}`);

            let placeholder = this.$('input#searchBox.form-control')[0].placeholder;
            assert.equal(placeholder, 'Test Placeholder');
        })
    });
});
