import Ember from 'ember';

export function draftTextInput([metadata, question]) {
    var response = metadata[question.qid].value;
    return response;
}

export default Ember.Helper.helper(draftTextInput);
