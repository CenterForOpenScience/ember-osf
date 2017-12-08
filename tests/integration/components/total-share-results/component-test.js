import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import tHelper from "ember-i18n/helper";
import Ember from 'ember';

// Stub i18n service
const i18nStub = Ember.Service.extend({
    t: function(word) {
        const translated = {
            'searchablePreprints': `searchable preprints`,
        };
        return translated[word];
    }
});
moduleForComponent('total-share-results', 'Integration | Component | total share results', {
  integration: true,
  beforeEach() {
      this.registry.register('helper:t', tHelper);
      this.register('service:i18n', i18nStub);
      this.inject.service('i18n', { as: 'i18n' });
  }
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('shareTotal', 100);
    this.set('shareTotalText', 'searchablePreprints');

    this.render(hbs`{{total-share-results
        shareTotal=shareTotal
        shareTotalText=shareTotalText
    }}`);
    assert.strictEqual(this.$('span')[0].innerText, '100 searchable preprints');
});
