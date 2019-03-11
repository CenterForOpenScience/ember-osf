//component/lazy-options.js
import Ember from 'ember';
import layout from './template';
import PSOptionsComponent from 'ember-power-select/components/power-select/options';
const {
    assert,
    get,
} = Ember;
const OptionsComponent = PSOptionsComponent.extend({
    layout,
    canLoadMore: false,
    init() {
        this._super(...arguments);
        assert('<component:infinite-options>: You must provide a closure action name `loadMore`', get(this, 'loadMore') && typeof get(this, 'loadMore') === 'function');
    },
});
export default OptionsComponent;
