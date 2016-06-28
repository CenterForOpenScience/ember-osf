import { draftTextInput } from 'dummy/helpers/draft-text-input';
import { module, test } from 'qunit';

module('Unit | Helper | draft text input');

test('looks up question in metadata', function(assert) {
    let question = {qid: 'looked'};
    let metadata = {looked: {'value': 'Yes'}};

    let result = draftTextInput([metadata, question]);
    assert.equal(result, 'Yes');
});
