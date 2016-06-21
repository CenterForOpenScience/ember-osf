import Ember from 'ember';

export function checkDataType(resource) {
    return Ember.typeOf(resource[0]);
}

export default Ember.Helper.helper(checkDataType);
