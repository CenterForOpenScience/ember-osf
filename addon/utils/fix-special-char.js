/**
 * @module ember-osf
 * @submodule utils
 */

/**
 * @class fix-special-char
 */

/**
 * This function is useful for fixing a bad API behavior. In certain cases the server will insert HTML escape
 * sequences into text, and this will replace `&amp;` sequences with `&`. Template helper and ember-data field versions
 * of this function are available.
 *
 * @method fixSpecialChar
 * @param {String} inputString A string value to be transformed
 * @return {String|null}
 */
export default function fixSpecialChar(inputString) {
    return inputString ? inputString.replace(/&amp;/g, '&') : inputString;
}

export { fixSpecialChar };
