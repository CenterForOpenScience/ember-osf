import Ember from 'ember';

export function draftTextInput([metadata, question, subquestion, subsubquestion]) {
    var response = '';
    if (subquestion) {
        if (metadata && metadata[question.qid] && metadata[question.qid].value[subquestion.id]) {
            if (subsubquestion) {
                if (metadata[question.qid].value[subquestion.id].value[subsubquestion.id]) {
                    response = metadata[question.qid].value[subquestion.id].value[subsubquestion.id].value;
                }
            } else {
                response = metadata[question.qid].value[subquestion.id].value;
            }
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
