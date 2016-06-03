import Ember from 'ember';
import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    fileManager: Ember.inject.service(),

    ajaxOptions() {
        // When reloading file models after a file action, bypass the cache
        let options = this._super(...arguments);
        if (this.get('fileManager.isReloading')) {
            let prefix = options.url.indexOf('?') === -1 ? '?' : '&';
            let nonce = Date.now();
            options.url += `${prefix}bypasscache=${nonce}`;
        }
        return options;
    }
});
