import Ember from 'ember';
import _ from 'lodash';
import layout from './template';

function skipAutosave(ctx, fn, as) {
    ctx.set('_skipAutosave', true);
    let ret = null;
    console.log('Start Skip');
    if (as) {
    ret = fn.bind(ctx)().then(() => {    console.log('End Skip (as)'); ctx.set('_skipAutosave', false)});
} else {
    console.log('End Skip (s)');
    fn.bind(ctx);
    // ctx.set('_skipAutosave', false);
}
    // } else {
    //     console.log('End Skip (s)');
    //     ctx.set('_skipAutosave', false);
    // }
    return ret;
}


export default Ember.Component.extend({
    layout,
    store: Ember.inject.service(),
    licensesAvailable: Ember.A(),
    showBorder: true,
    showYear: true,
    showText: false,
    toggleText: true,
    showCopyrightHolders: true,
    showCategories: true,
    allowDismiss: false,
    _skipAutosave: false,
    init() {
        this._super(...arguments);
        // Debouncing autosave prevents a request per keystroke, only sending it
        // when the user is done typing (trailing=true), debounce timer can be tweaked.
        this.set('debouncedAutosave', _.debounce(() => {
            console.log('asdjiasjdiajsidjaisjdiajsdijais')
            if (this.get('autosave')) {
                this.get('actions.save').bind(this)();
            }
        }, 500, {trailing: true}));

        skipAutosave(this, () => {
            let date = new Date();
            this.set('year', String(date.getUTCFullYear()));
        });
        skipAutosave(this, () =>
            this.get('store').query('license', { 'page[size]': 20 })
            .then(ret => {console.log('Resolve Get Licenses'); return this.get('_updateNodeLicense').bind(this)(ret)}),
        true);
    },
    showOtherFields: Ember.observer('nodeLicense', 'nodeLicense.text', function() {
        let text = this.get('nodeLicense.text');
        if (!text) {
            return;
        }
        this.set('showYear', text.indexOf('{{year}}') !== -1);
        this.set('showCopyrightHolders', text.indexOf('{{copyrightHolders}}') !== -1);
    }),
    yearRequired: Ember.computed('nodeLicense', function() {
        return this.get('nodeLicense.requiredFields') && this.get('nodeLicense.requiredFields').indexOf('year') !== -1;
    }),
    copyrightHoldersRequired: Ember.computed('nodeLicense', function() {
        return this.get('nodeLicense.requiredFields') && this.get('nodeLicense.requiredFields').indexOf('copyrightHolders') !== -1;
    }),
    _updateNodeLicense(licenses) {
        return new Ember.RSVP.Promise((resolve) => {
            this.set('licensesAvailable', licenses);
            console.log('updateNodeLicense');
            if (!this.get('currentValues.licenseType.id')) { //if not resolved properly
                this.set('nodeLicense', this.get('licensesAvailable.firstObject'));
            } else {
                this.set('nodeLicense', this.get('currentValues.licenseType'));
            }
            resolve();
        });
    },
    _updateYear: Ember.observer('currentValues.year', function() {
        skipAutosave(this, () =>
             new Ember.RSVP.Promise((resolve) => {
                 this.set('year', this.get('currentValues.year'));
                 resolve();
             })
         , true);
    }),
    _updateCopyrightHolders: Ember.observer('currentValues.copyrightHolders', function() {
        // skipAutosave(this, () => {console.log('_updateYear'); this.set('copyrightHolders', this.get('currentValues.copyrightHolders'))});
    }),
    _updateLicense: Ember.observer('licenses', function() {
        skipAutosave(this, () => this.get('_updateNodeLicense').bind(this)(this.get('licenses')));
    }),
    nodeLicenseText: Ember.computed('nodeLicense', 'nodeLicense.text', 'year', 'copyrightHolders', function() {
        let text = this.get('nodeLicense.text');
        if (text) {
            text = text.replace(/({{year}})/g, this.get('year') || '');
            text = text.replace(/({{copyrightHolders}})/g, this.get('copyrightHolders') || '');
        }
        return text;
    }),
    licenseEdited: Ember.observer('copyrightHolders', 'nodeLicense', 'year', function() {
        debugger;
        if (!this.get('_skipAutosave')) {
            this.get('debouncedAutosave')();
        }
    }),
    year: null,
    copyrightHolders: null,
    actions: {
        selectLicense(license) {
            this.set('nodeLicense', license);
        },
        toggleFullText() {
            this.set('showText', !this.get('showText'));
        },
        save() {
            let values = {
                licenseType: this.get('nodeLicense'),
                year: this.get('year'),
                copyrightHolders: this.get('copyrightHolders') ? this.get('copyrightHolders') : ''
            };
            this.attrs.editLicense(
                values,
                !((this.get('yearRequired') && !values.year) || (this.get('copyrightHoldersRequired') && values.copyrightHolders.length === 0))
            );
        },
        sendSubmit() {
            this.sendAction('pressSubmit');
        },
        dismiss() {
            this.attrs.dismiss();
        }
    }
});
