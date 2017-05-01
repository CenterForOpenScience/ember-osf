import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import tHelper from "ember-i18n/helper";

// Stub i18n service
const i18nStub = Ember.Service.extend({
    t: function(word) {
        const translated = {
            'eosf.components.searchFacetLanguage.add': 'Add'
        };
        return translated[word];
    }
});

moduleForComponent('search-facet-language', 'Integration | Component | search facet language', {
    integration: true,
    beforeEach() {
        // register the helper:
        this.registry.register('helper:t', tHelper);
        this.register('service:i18n', i18nStub);
        this.inject.service('i18n', { as: 'i18n' });
    }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
        this.set('key', 'languages');
        this.set('options', { key: 'languages', title: 'Language', component: 'search-facet-language' } );
        this.set('state', '');
        this.set('filter', '');
        this.set('onChange', () => {});

        this.render(hbs`{{search-facet-language
            key=key
            options=options
            state=state
            filter=filter
            onChange=(action onChange)
        }}`);

        assert.equal(this.$()[0].innerText.trim(), 'Add Language filter');
});

