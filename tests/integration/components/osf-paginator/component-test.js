import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osf-paginator', 'Integration | Component | osf paginator', {
  integration: true
});

test('rendering for 100 results', function(assert) {

  this.set('totalSearchResults', 100);
  this.render(hbs`{{osf-paginator totalSearchResults=totalSearchResults}}`);

  assert.equal(this.$('a')[0].text, '<');
  assert.equal(this.$('a')[1].text, '1');
  assert.equal(this.$('a')[2].text, '2');
  assert.equal(this.$('a')[3].text, '3');
  assert.equal(this.$('a')[4].text, '4');
  assert.equal(this.$('a')[5].text, '5');
  assert.equal(this.$('a')[6].text, '...');
  assert.equal(this.$('a')[7].text, '10');
  assert.equal(this.$('a')[8].text, '>');
});


test('rendering for 40 results', function(assert) {

  this.set('totalSearchResults', 40);
  this.render(hbs`{{osf-paginator totalSearchResults=totalSearchResults}}`);

  assert.equal(this.$('a')[0].text, '<');
  assert.equal(this.$('a')[1].text, '1');
  assert.equal(this.$('a')[2].text, '2');
  assert.equal(this.$('a')[3].text, '3');
  assert.equal(this.$('a')[4].text, '4');
  assert.equal(this.$('a')[5].text, '>');
});
