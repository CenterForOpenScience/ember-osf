import Ember from 'ember';

export function permissionHelper(params) {
    if (params[0] === params[1]) {
        return 'selected';
    }
    return null;
}

export default Ember.Helper.helper(permissionHelper);
