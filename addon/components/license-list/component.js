import Ember from 'ember';
import layout from './template';

const defaultCategories = {
    Content: name => name.indexOf('CC') !== -1,
    'Code - Permissive': name => name.indexOf('MIT') !== -1 || name.indexOf('Apache') !== -1 || name.indexOf('BSD') !== -1,
    'Code - Copyleft': name => name.indexOf('GNU') !== -1 && name.indexOf('Lesser') === -1
}

export default Ember.Component.extend({
    layout,
    _selectedLicense: null,
    selectedLicense: Ember.computed('currentLicense', 'licenses', '_selectedLicense', function() {
        if (this.get('_selectedLicense') !== null) {
            return this.get('_selectedLicense');
        }
        return this.get('currentLicense');
    }),
    categories: Ember.A(),
    categoriesSeparator: Ember.observer('licenses', function() {
        if (!this.get('showCategories') || !this.get('licenses')) {
            return;
        }
        let categories = [];
        let hasOther = false;
        let cat = {
            Content: [],
            'Code - Permissive': [],
            'Code - Copyleft': [],
            'Code - Other': []
        }
        this.get('licenses').forEach(each => {
            if (each.get('name') == 'No license') {
                categories.push({
                    licenses: [each]
                });
            } else if (each.get('name') == 'Other') {
                hasOther = {
                    licenses: [each]
                };
            } else {
                let pass = false;
                for (var key of Object.keys(defaultCategories)) {
                    if (defaultCategories[key](each.get('name'))) { //does it match the rule
                        cat[key].push(each);
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    cat['Code - Other'].push(each);
                }

            }
        });
        for (var key of Object.keys(cat)) {
            if (cat[key].length) {
                categories.push({
                    title: key,
                    licenses: cat[key]
                })
            }
        }
        if (hasOther) {
            categories.push(hasOther);
        }
        this.set('categories', categories);
    }),
    actions: {
        select(license) {
            this.set('_selectedLicense', license);
            this.sendAction('select', license);
        }
    }
});
