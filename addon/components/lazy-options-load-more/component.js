import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';
import layout from './template';

export default Component.extend(InViewportMixin, {
    layout,
    didEnterViewport() {
        this.get('loadMore')();
    },
});
