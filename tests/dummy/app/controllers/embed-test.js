import Ember from 'ember';

export default Ember.Controller.extend({
    fetchedNode: null,
    fetchedChild: null,
    actions: {
        fetchNodePreprintsEmbedded() {
            this.store.findRecord('node', 'ee2t9').then((node) => {
                this.set('fetchedNode', node);
            });
        },
        fetchNodeParentEmbedded() {
            this.store.findRecord('node', 'pe8s6').then((node) => {
                this.set('fetchedChild', node);
            });
        }
      }
});
