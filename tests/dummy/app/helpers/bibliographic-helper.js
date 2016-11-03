import Ember from 'ember';

export function bibliographicHelper(params) {
    // checks if bibliographic is true or false
    if (params[0]) {
        return 'checked';
    }
    return null;
}

export default Ember.Helper.helper(bibliographicHelper);
