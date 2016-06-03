import Ember from 'ember';

export default Ember.Mixin.create({
    fileManager: Ember.inject.service(),

    ajaxOptions() {
        // When reloading file models after a file action, bypass the cache
        let options = this._super(...arguments);
        if (this.get('fileManager.isReloading')) {
            let prefix = options.url.indexOf('?') === -1 ? '?' : '&';
            let nonce = Date.now();
            options.url += `${prefix}cachebypass=${nonce}`;
        }
        return options;
    }
});
