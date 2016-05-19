import Ember from 'ember';
import config from 'ember-get-config';

export function buildMfrUrl(params/*, hash*/) {
    var base = config.OSF.renderUrl;
    var download = params[0];
    var renderUrl = base + '?url=' + download;
    // return renderUrl;
    return 'http://localhost:7778/render?url=http://localhost:5000/zps63/?action=download%26direct%26mode=render&initialWidth=766&childId=mfrIframe';
}

export default Ember.Helper.helper(buildMfrUrl);
