import Ember from 'ember';
import layout from './template';

const defaultCategories: {
    Content: name => name.indexOf('CC') !== -1,
    'Code - Permissive': name => name.indexOf('MIT') !== -1 || name.indexOf('Apache') !== -1 || name.indexOf('BSD') !== -1,
    'Code - Copyleft': name => name.indexOf('GNU') !== -1 && name.indexOf('Lesser') === -1
}

export default Ember.Component.extend({
    layout,
    categories: Ember.computed('licenses', function() {
        if (!this.get('showCategories')) {
            return;
        }
        let categories = [];
        let hasOther = false;
        let cat = {
            Content: []
            'Code - Permissive': [],
            'Code - Copyleft': [],
            'Code - Other': []
        }
        this.get('licenses').forEach(each => {
            if (each.name == 'No license') {
                categories.push({
                    licenses: [each]
                });
            } else if (each.name == 'Other') {
                hasOther = {
                    licenses: [each]
                };
            } else {
                let pass = false;
                for (var [key, value] of defaultCategories) {
                    if (value(each.name)) { //does it match the rule
                        cat[key].push(each);
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    cat['Code - Other'].push(each)
                }

            }
        });
        for (var [key, value] of cat) {
            if (value.length) {
                categories.push({
                    title: key,
                    licenses: value
                })
            }
        }
        if (hasOther) {
            categories.push(hasOther);
        }
        return categories;
    })
});
