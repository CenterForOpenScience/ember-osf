import Ember from 'ember';

export function selectedHelper(params) {
    if (params[0] === params[1]) {
        return 'selected';
    }
    return null;
}

export default Ember.Helper.helper(selectedHelper);
