import Ember from 'ember';
import config from 'ember-get-config';

/**
 * shareDetailURL helper - Generates link to share detail page for particular resource
 *
 * @method shareDetailURL
 * @param {Object} resource SHARE resource (needs resource type and resource id)
 * @return {String} Returns SHARE detail URL
 */
export function shareDetailURL(params/*, hash*/) {
    const [resource] = params;
    const baseUrl = config.SHARE.baseUrl;
    return baseUrl + resource.type + '/' + resource.id;
}

export default Ember.Helper.helper(shareDetailURL);
