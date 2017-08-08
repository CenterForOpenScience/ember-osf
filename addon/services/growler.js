import Ember from 'ember';

const Growl = Ember.Object.extend({
    timer: 5000,
    type: 'danger',
    message: 'Something went wrong.',
    dismissed: false,
    dismissable: true
})

/**
 * @module ember-osf
 * @submodule services
 */

/**
 * Can be called to 'growl' error and success messages app-wide. Needs growl-box
 * to be present in the template to output growls.
 * Example use: this.get('growler').growl({message: 'Request timed out.'})
 *
 * @class growler
 * @extends Ember.Service
 */
export default Ember.Service.extend({
    _growls: Ember.A(),
    growls: Ember.computed.filterBy('_growls', 'dismissed', false),
    growl(args) {
        let growl = Growl.create(args);
        this.get('_growls').pushObject(growl);
        if (growl.get('timer')) {
            setTimeout(() => {
                this.get('_growls').removeObject(growl);
            }, growl.get('timer'));
        }
    },
    clean() {
        this.get('_growls').clear();
    }
});
