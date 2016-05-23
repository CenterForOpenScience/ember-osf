import Ember from 'ember';

export default Ember.Controller.extend({
    editedPermissions: {},
    editedBibliographic: {},
    actions: {
        expandProperties() {
            this.toggleProperty('propertiesVisible');
        },
        permissionChange(permission) {
            // Adds updated permissions for a certain contributor
            var p = permission.split(' ');
            var permissions = p[0];
            var contributorId = p[1];
            this.editedPermissions[contributorId] = permissions;
        },
        bibliographicChange(target) {
            // Adds updated bibliographic info for a certain contributor
            var bibliographic = target.checked;
            var contributorId = target.value;
            this.editedBibliographic[contributorId] = bibliographic;
});
