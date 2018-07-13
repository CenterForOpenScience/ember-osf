import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('discover-page', 'Integration | Component | discover page', {
  integration: true
});

test('it renders', function(assert) {
    let noop = () => {};
    this.set('noop', noop);

    this.render(
        hbs`{{cookie-banner 
              addCookie=(action noop)}}`);

    assert.ok(this.$());
});
