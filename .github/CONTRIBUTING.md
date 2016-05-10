# Style/Conventions

### Naming conventions

Please review and adhere to the naming conventions defined [here](http://ember-cli.com/user-guide/#naming-conventions)

### Accessability

The [ember-a11y](https://www.npmjs.com/package/ember-a11y) addon is a dependency of this addon, and helps facilitate compliance with the guidelines laid out by the [A11y Project](http://a11yproject.com/). This requires one simple change: wherever you would normally use the `{{outlet}}` helper, instead use `{{focusing-outlet}}`. See the project page for more details.

### Internationalization

_(In Progress)_ We plan to use the [ember-i18n](https://github.com/jamesarosen/ember-i18n) addon for internationalization support in all components. The main change required here is that all blocks of text should be wrapped with the `t` helper supplied by this library. Read more here: [https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Translating-Text](https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Translating-Text)

### Components

We will use "pod" style structure for all of the components in this addon. As long as you use the ember-cli to generate the component scaffolds (`ember g component my-component`) , this should happend by default. Basically components should be structured like:

- addon/components/<name>/
  - component.js
  - template.hbs
  - style.scss (optional)

#### Styling components

Leveraging the [ember-component-css](https://github.com/ebryn/ember-component-css) addon will allow us to bundle [Sass](http://sass-lang.com/) files inside components' pod structure, and will automatically namespace those styles to avoid all possible CSS collisions. This approach will allow for easy overrides and paramterization via top-level Sass variables.

# Testing


## Unit tests

We aim to have near-full test coverage of the code in this addon. That said we want to avoid testing the Ember core or third-party libraries, so some general guidelines for unit tets (minumum requirements):

**Models**
_Do test_:
- helper methods
- custom transforms

**Components/Mixins**
_Do test_:
- methods
- computed values

## Integration tests

Integration tests allow us to see how components behave while actually running in a browser enviornment. [TODO](https://openscience.atlassian.net/browse/EOSF-28)
