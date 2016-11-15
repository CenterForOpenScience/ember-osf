import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  nodeLicense: null,
  year: null,
  copyrightHolders: Ember.A(),
  actions: {
      save() {
          let values = {
              licenseType: this.get('nodeLicense'),
              year: this.get('year'),
              copyrightHolders: this.get('copyrightHolders')
          };
          this.attrs.editLicense(values);
      },
      dismiss() {
          this.attrs.dismiss();
      }
  }
});
