import Ember from 'ember';

export function localeString([value]) {
    return !!value ? value.toLocaleString() : value;
}

export default Ember.Helper.helper(localeString);
