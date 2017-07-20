import Ember from 'ember';
import extractDoiFromString from '../utils/extract-doi-from-string';

export function extractDoi(params) {
  return extractDoiFromString(params[0]);
}

export default Ember.Helper.helper(extractDoi);
