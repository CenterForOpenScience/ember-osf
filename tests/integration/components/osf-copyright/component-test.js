import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('osf-copyright', 'Integration | Component | osf copyright', {
  integration: true
});

test('it renders', function(assert) {

  const year = sinon.useFakeTimers(new Date(1648,1,1).getTime());
  this.render(hbs`{{osf-copyright}}`);
  const currentYear= this.$('div.container span.copyright').text().trim().split('-');
  assert.equal(currentYear[1], '1648');
  year.restore();
});
