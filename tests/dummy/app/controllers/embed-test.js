import Ember from 'ember';

export default Ember.Controller.extend({
    fetchedNode: null,
    fetchedChild: null,
    actions: {
        fetchNodePreprintsEmbedded() {
            this.store.findRecord('node', '7gzxb', {include: 'preprints'}).then((node) => {
                this.set('fetchedNode', node);
            });
        },
        fetchNodeParentEmbedded() {
            this.store.findRecord('node', 'ddyuz', {include: 'parent'}).then((node) => {
                this.set('fetchedChild', node);
            });
        }
      }
});
