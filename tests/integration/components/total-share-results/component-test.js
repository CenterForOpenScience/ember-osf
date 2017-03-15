import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('total-share-results', 'Integration | Component | total share results', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('shareTotal', 100);
    this.set('shareTotalText', 'searchable preprints');

    this.render(hbs`{{total-share-results
        shareTotal=shareTotal
        shareTotalText=shareTotalText
    }}`);
    assert.ok(this.$().text().trim().includes('100 searchable preprints'));
});
