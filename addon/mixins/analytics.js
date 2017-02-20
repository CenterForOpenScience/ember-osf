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
    // Add this mixin to your route, and the afterModel hook will track pageviews.  Be sure to call super if using afterModel hook in route!
    afterModel(model, transition) { // Using afterModel hook so node info can be sent to keen
        let transitionData = {
            pageViewed: {
                page: transition.targetName,
                queryParams: transition.queryParams,
            }
        };
        if (model.id) {
            transitionData.pageViewed.relatedModel = model.id;
            transitionData.pageViewed.modelType = model.constructor.modelName;
        }
        Ember.get(this, 'metrics')
            .trackPage(transitionData, model);
    },
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
