import Ember from 'ember';
import config from 'ember-get-config';

export function buildMfrUrl(params/*, hash*/) {
    var base = config.OSF.renderUrl;
    var download = params[0];
    var renderUrl = base + '?url=' + encodeURIComponent(download);
    return renderUrl;
}

export default Ember.Helper.helper(buildMfrUrl);
