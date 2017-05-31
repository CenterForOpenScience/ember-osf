import Ember from 'ember';
import fixSpecialChar from '../utils/fix-special-char';

export function fixSpecialCharHelper(params/*, hash*/) {
    return params ? fixSpecialChar(params[0]) : params;
}

export default Ember.Helper.helper(fixSpecialCharHelper);
