import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-browser-icon', 'Integration | Component | file browser icon', {
    integration: true
});

test('default file icon', function(assert) {
    this.render(hbs`{{file-browser-icon}}`);

    assert.ok(this.$().html().indexOf('file-o') !== -1);
});

test('file type not found uses default', function(assert) {
    let file = { itemName: 'file.notafiletype' };
    this.set('item', file);
    this.render(hbs`{{file-browser-icon item=item}}`);

    assert.ok(this.$().html().indexOf('file-o') !== -1);
});

test('file doesnt have a type, uses default', function(assert) {
    let file = { itemName: 'doesntevenhaveatypelikewow' };
    this.set('item', file);
    this.render(hbs`{{file-browser-icon item=item}}`);

    assert.ok(this.$().html().indexOf('file-o') !== -1);
});

test('file gets the right icon for type', function(assert) {
    let file = { itemName: 'normalfilefornormalpeople.c' };
    this.set('item', file);
    this.render(hbs`{{file-browser-icon item=item}}`);

    assert.ok(this.$().html().indexOf('file-o') === -1);
    assert.ok(this.$().html().indexOf('file-code-o') !== -1);
});
