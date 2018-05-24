import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-help-modal', 'Integration | Component | search help modal', {
  integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('showLuceneHelp', true);
    this.render(hbs`{{search-help-modal isOpen=showLuceneHelp}}`);
    assert.equal(this.$('.ex-list').text().replace(/\s+/g, ' ').trim(), 'repro* brian AND title:many tags:(psychology)');
    this.set('showLuceneHelp', false);
    this.render(hbs`{{search-help-modal isOpen=showLuceneHelp}}`);
    assert.equal(this.$('.ex-list').text().replace(/\s+/g, ' ').trim(), '');
});
