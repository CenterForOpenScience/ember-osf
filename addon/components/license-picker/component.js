import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  store: Ember.inject.service(),
  init: function() {
      this._super(...arguments);
      this.get('store').query('license', {'page[size]': 20}).then(ret => {
         this.set('licensesAvailable', ret);
      });
  },
  nodeLicenseText: Ember.computed('nodeLicense.text', 'year', 'copyrightHolders', function() {
      let text = this.get('nodeLicense.text');
      if (!text) {
          return '';
      }
      text = text.replace(/({{year}})/g, this.get('year') || '');
      text = text.replace(/({{copyrightHolders}})/g, this.get('copyrightHolders') || '');
      return text;
  }),

  // nodeLicense: Ember.computed('licensesAvailable', function() {
  //     return this.get('currentValues.licenseType') || this.get('licensesAvailable')[0];
  //     //return this.get('store').findRecord('license', '57a8c6b752386caf6a68df1e');//this.get('licenseId'));
  // }),
  // licensesAvailable: Ember.computed('currentValues', 'attrs.licenses', function() {
  //     //if (!this.get('attrs.licenses.value') || this.get('attrs.licenses').length === 0) {
  //         return this.get('store').query('license', {'page[size]': 20}).then(ret => {
  //             ret.forEach(each => {
  //                 console.log(each.get('name'));
  //                 if (each.get('name') === "No license") {
  //
  //                     this.set('nodeLicense', each);
  //                 }
  //             })
  //           //   this.set('nodeLicense', ret[0]);
  //             return ret;
  //         });
  //     //}
  //     //return this.get('licenses');
  // }),
  year: null,
  copyrightHolders: null,
  actions: {
      selectLicense(license) {
          this.set('nodeLicense', license);
      },
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
