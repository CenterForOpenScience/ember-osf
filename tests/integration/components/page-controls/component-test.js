import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('page-controls', 'Integration | Component | page controls', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('page', 1);
    this.set('clampedPages', 3);
    this.set('loadPage', () => {});

  this.render(hbs`{{page-controls
      page=page
      clampedPages=clampedPages
      loadPage=(action loadPage)
  
  }}`);

  assert.equal(this.$()[0].innerText.trim(), '1 2 3');
});
