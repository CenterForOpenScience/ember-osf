import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('comment-detail', 'Integration | Component | comment detail', {
  integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    let noop = () => {};
    this.set('comment', {
        dateCreated: '05-19-2016',
        content: 'hello'
    });

    this.set('noop', noop);

    this.render(
        hbs`{{comment-detail 
              model=comment 
              editComment=(action noop)
              deleteComment=(action noop)
              restoreComment=(action noop)
              reportComment=(action noop)}}`);

    assert.ok(this.$('div:contains("05-19-2016")'));
    assert.ok(this.$('input[value=hello]'));

});
