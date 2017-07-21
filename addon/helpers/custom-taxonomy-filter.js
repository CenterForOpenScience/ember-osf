import Ember from 'ember';

var customTaxonomies = ['bepress'];

export function customTaxonomyFilter(params/*, hash*/) {
    let words = params[0].split('|');
    return words.length > 1 ? words[words.length - 1] : params[0];
}

export default Ember.Helper.helper(customTaxonomyFilter);
