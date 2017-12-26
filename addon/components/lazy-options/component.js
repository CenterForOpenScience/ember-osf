//component/lazy-options.js
import Ember from 'ember';
import layout from './template';
import PSOptionsComponent from 'ember-power-select/components/power-select/options';
const {
    $,
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
    didInsertElement() {
        this._super(...arguments);
        const checkVisibility = () => {
            if ($(this.element).find('.ember-power-select-option--load-more').checkInView(true)) {
                const loadMore = get(this, 'loadMore');
                return loadMore();
            }
        };
        $(this.element).on('scroll', () => checkVisibility());
    },
    willDestroyElement() {
        this._super(...arguments);
        $(this.element).off('scroll');
    }
});
export default OptionsComponent;
