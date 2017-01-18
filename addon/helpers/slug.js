import Ember from 'ember';

export function slug([type]) {
    return type.classify().toLowerCase();
}

export default Ember.Helper.helper(slug);
