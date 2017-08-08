import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-browser', 'Integration | Component | file browser', {
    integration: true,
    beforeEach() {
        this.set('files', Ember.A())
    }
});

test('test name\'s column width', function(assert) {
    this.set('display', ['header']);
    this.render(hbs`{{file-browser files=files display=display}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '12'); //welp there's probably a better way of doing this

    this.set('display', ['header', 'share-link-column']);
    this.render(hbs`{{file-browser files=files display=display}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '10');

    //Test default behavior
    this.render(hbs`{{file-browser files=files}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '5');
});
