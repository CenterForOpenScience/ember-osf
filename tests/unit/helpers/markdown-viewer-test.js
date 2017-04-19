import { markdownViewer } from 'ember-osf/helpers/markdown-viewer';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Helper | markdown viewer helper');

const htmlSafe = Ember.String.htmlSafe;

test('test emphasize rendering', function(assert) {
    let result = markdownViewer(['*test italic*']);
    assert.equal(result.toString().trim(), htmlSafe('<p><em>test italic</em></p>').toString().trim());
});

test('test emphasize rendering', function(assert) {
    let result = markdownViewer(['**test bold**']);
    assert.equal(result.toString().trim(), htmlSafe('<p><strong>test bold</strong></p>').toString().trim());
});
