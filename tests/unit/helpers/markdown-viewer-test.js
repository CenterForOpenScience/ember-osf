import { markdownViewer } from 'ember-osf/helpers/markdown-viewer';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Helper | markdown viewer helper');

const htmlSafe = Ember.String.htmlSafe;

test('test emphasize italic rendering', function(assert) {
    let result = markdownViewer(['*test italic*']);
    assert.equal(result.toString().trim(), htmlSafe('<p><em>test italic</em></p>').toString().trim());
});

test('test emphasize bold rendering', function(assert) {
    let result = markdownViewer(['**test bold**']);
    assert.equal(result.toString().trim(), htmlSafe('<p><strong>test bold</strong></p>').toString().trim());
});

test('test header not rendering', function(assert) {
    let result = markdownViewer(['# test header']);
    assert.equal(result.toString().trim(), htmlSafe('<p># test header</p>').toString().trim());
});

test('test code not rendering', function(assert) {
    let result = markdownViewer(['```javascript' +
    '(function(){' +
    'console.log(test code);' +
    '});' +
    '```']);
    assert.equal(result.toString().trim(), htmlSafe('<p>```javascript(function(){console.log(test code);});```</p>').toString().trim());
});

test('test list rendering', function(assert) {
    let result = markdownViewer(['* test 1\n' +
    '* test 2\n' +
    '* test 3']);
    assert.equal(result.toString().trim(), htmlSafe('<ul>\n<li>test 1</li>\n<li>test 2</li>\n<li>test 3</li>\n</ul>').toString().trim());
});