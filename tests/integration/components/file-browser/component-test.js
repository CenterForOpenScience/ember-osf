import Ember from 'ember';
import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-browser', 'Integration | Component | file browser', {
    integration: true,
    beforeEach() {
        this.set('items', Ember.A())
    }
});

test('test name\'s column width', function(assert) {
    this.set('display', ['header']);
    this.render(hbs`{{file-browser newItems=items display=display}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '12'); //welp there's probably a better way of doing this

    this.set('display', ['header', 'share-link-column']);
    this.render(hbs`{{file-browser items=items display=display}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '10');

    //Test default behavior
    this.render(hbs`{{file-browser items=items}}`);
    assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '5');
});

skip('filtering works', function(assert) {
    Ember.run(() => {
        this.set('items', Ember.A([
            {name: 'file one'},
            {name: 'file two'}
        ]));
        this.set('filtering', true);
        this.set('textValue', '');

        this.render(hbs`{{file-browser newItems=items filtering=filtering textValue=textValue}}`);
        Ember.run.next(() => {
            assert.ok(this.$().text().indexOf('file one') !== -1, 'File one was not shown');
            assert.ok(this.$().text().indexOf('file two') !== -1, 'File two was not shown');
        });
    })
    // this.set('textValue', 'one');
    //
    // this.render(hbs`{{file-browser newItems=items filtering=filtering textValue=textValue}}`);
    // assert.ok(this.$().text().indexOf('file one') !== -1, 'File one was not shown');
    // assert.ok(this.$().text().indexOf('file two') === -1, 'File two was shown');
});