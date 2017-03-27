import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 *  Analytics mixin. Provides actions that can be used in templates to track events (can send to multiple
 *  analytics services)
 *
 * @class Analytics
 */
export default Ember.Mixin.create({
    metrics: Ember.inject.service(),
    actions: {
        click(category, label, extra) {
            if (extra && extra.toString() === '[object MouseEvent]') {
                extra = null;
            }
            Ember.get(this, 'metrics')
                .trackEvent({
                    category,
                    action: 'click',
                    label,
                    extra
                });

            return true;
        },
        track(category, action, label, extra) {
            if (extra && extra.toString() === '[object MouseEvent]') {
                extra = null;
            }
            Ember.get(this, 'metrics')
                .trackEvent({
                    category,
                    action,
                    label,
                    extra
                });
            return true;

        }
    }
});
