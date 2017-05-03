import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-facet-locked', 'Integration | Component | search facet locked', {
  integration: true
});

test('search-facet-locked displays locked item', function(assert) {
    this.set('options', {
        locked_items: ['PubMed Central']
    });
    this.render(hbs`{{search-facet-locked
        options=options
    }}`);

    assert.equal(this.$().text().trim(), 'PubMed Central');
});

