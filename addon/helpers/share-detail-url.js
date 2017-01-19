import Ember from 'ember';
import config from 'ember-get-config';

/**
 * shareDetailURL helper - Generates link to share detail page for particular resource
 *
 * @method shareDetailURL
 * @param {String} type of SHARE resource
 * @param {String} id of SHARE resource
 * @return {String} Returns SHARE detail URL
 */
export function shareDetailURL(params/*, hash*/) {
    const [type, id] = params;
    const baseUrl = config.SHARE.baseUrl;
    return baseUrl + type + '/' + id;
}

export default Ember.Helper.helper(shareDetailURL);
