import Ember from 'ember';

const Growl = Ember.Object.extend({
    timer: 5000,
    type: 'danger',
    message: 'Something went wrong.',
    dismissed: false,
    dismissable: true
})

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
    }
});
