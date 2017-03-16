import { markdownViewer } from 'ember-osf/helpers/markdown-viewer';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Helper | markdown viewer helper');

const htmlSafe = Ember.String.htmlSafe;

test('test h1 rendering', function(assert) {
    let result = markdownViewer(['# test h1']);
    assert.equal(result.toString().trim(), htmlSafe('<h1>test h1</h1>').toString().trim());
});

test('test h2 rendering', function(assert) {
    let result = markdownViewer(['## test h2']);
    assert.equal(result.toString().trim(), htmlSafe('<h2>test h2</h2>').toString().trim());
});

test('test emphasize rendering', function(assert) {
    let result = markdownViewer(['*test emphasize*']);
    assert.equal(result.toString().trim(), htmlSafe('<p><em>test emphasize</em></p>').toString().trim());
});
