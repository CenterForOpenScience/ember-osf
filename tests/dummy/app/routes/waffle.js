import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store.query('waffle', {samples: 'test_sample', flags:'test_flag,second_flag', switches: 'test_switch'});
    }
});
