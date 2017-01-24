import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-facet-daterange', 'Integration | Component | search facet daterange', {
  integration: true
});

test('it renders', function(assert) {
    this.set('key', 'date');
    this.set('options', { key: 'date', title: 'Date', component: 'search-facet-daterange' });
    this.set('state', '');
    this.set('filter', '');
    this.set('onChange', () => {});

    this.render(hbs`{{search-facet-daterange
        key=key
        options=options
        state=state
        filter=filter
        onChange=(action onChange)
    }}`);

    assert.equal(this.$().text().trim(), 'All time');
});


