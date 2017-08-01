import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('donate-banner', 'Integration | Component | donate banner', {
  integration: true
});


test('it renders', function(assert) {

    this.set('testDate', new Date('August 7, 2017'));

    this.render(hbs`{{donate-banner currentDate=testDate}}`);

    assert.equal(this.$('div').attr('style'), 'display:""');

});

test('does not show', function(assert) {

    this.set('testDate', new Date('June 1, 2017'));

    this.render(hbs`{{donate-banner currentDate=testDate}}`);

    assert.equal(this.$('div').attr('style'), 'display:none');

});
