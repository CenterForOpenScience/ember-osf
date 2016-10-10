import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display information about one revision of a file
 *
 * Sample usage:
 * ```handlebars
 * {{file-version
 * version=version
 * download='download'}}
 * ```
 * @class file-version
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-version'],
    tagName: 'tr',

    classNameBindings: ['isActive:active'],

    isActive: Ember.computed('version.id', 'activeVersion', function() {
        return this.get('version.id') === this.get('activeVersion');
    }),

    actions: {
        downloadVersion(version) {
            this.sendAction('download', version);
        },

        copy(className) {
            this.$(`.${className}`).select();
            document.execCommand('copy');
        }
    },

    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            // console.log(this.$('.fa-question-circle').popover());
            this.$('.fa-question-circle')
                .each(function() {
                    $(this).popover();
                });
            // this.$('button[data-clipboard-text]').on('click', () => {
            //     console.log('test');
            // });
        });
    }
});
