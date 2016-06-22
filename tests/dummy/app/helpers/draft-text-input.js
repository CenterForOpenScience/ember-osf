import Ember from 'ember';

export function draftTextInput([metadata, question, deepNest]) {
    var response = '';
    if (deepNest) {
        if (metadata && metadata[question.qid]) {
            response = metadata[question.qid].value.question.value;
        }
    } else {
        if (metadata && metadata[question.qid]) {
            if (Ember.typeOf(metadata[question.qid].value) === 'array') {
                response = metadata[question.qid].value[0];
            } else {
                response = metadata[question.qid].value;
            }
        }
    }
    return response;
}

export default Ember.Helper.helper(draftTextInput);
