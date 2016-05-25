import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

export default Ember.Component.extend({
    layout,
    download: null,
    width: '100%',
    height: '100%',
    mfrUrl: Ember.computed('download', function() {
        var base = config.OSF.renderUrl;
        var download = this.get('download');
        var renderUrl = base + '?url=' + encodeURIComponent(download + '?direct&mode=render&initialWidth=766');
        return renderUrl;
    })
});
