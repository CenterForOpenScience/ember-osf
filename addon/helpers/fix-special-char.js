import Ember from 'ember';
import fixSpecialChar from '../utils/fix-special-char';

/**
 Apply the `fix-special-char` utility function to clean up malformed text sent from the server.

 Usage example:
 ```handlebars
    This is text we want to fix: {{fix-special-char 'Now &amp; then'}}
  ```

  @class fix-special-char-helper
  @uses fix-special-char
 */
export function fixSpecialCharHelper(params/*, hash*/) {
    return params ? fixSpecialChar(params[0]) : params;
}

export default Ember.Helper.helper(fixSpecialCharHelper);
