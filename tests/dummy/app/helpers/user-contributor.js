import Ember from 'ember';

export function userContributor(params/*, hash*/) {
    var user = params[0];
    var contributors = params[1];
    if (contributors) {
        var found = false;
        contributors.forEach(function(contrib) {
            if (contrib.id.split('-')[1] === user.id) {
                found = true;
            }
        });
        return found;
    } else {
        return params;
    }
}

export default Ember.Helper.helper(userContributor);
