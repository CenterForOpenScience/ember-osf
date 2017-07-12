import Ember from 'ember';

var customTaxonomies = ['bepress'];

export function customTaxonomyFilter(params/*, hash*/) {
    let words = params[0].split('/');
    if (customTaxonomies.indexOf(words[0]) !== -1 && words.length > 1) {
        return words[words.length - 1];
    }
    return params[0];
}

export default Ember.Helper.helper(customTaxonomyFilter);
