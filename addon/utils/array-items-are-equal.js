/**
 * Check that all of the items in a are in b, and that all of the items in b are
 * in a.
 *
 * @function arrayItemsAreEqual
 * @param {Array} a the first array
 * @param {Array} b the second array
 * @param {Function} compareItems an optional function to use to compare array
 * items
 * @return {Boolean}
 **/
export default function arrayItemsAreEqual(a, b, compareItems) {
    if (a.length !== b.length) {
        return false;
    } else {
        var length = a.length;
        for (var i = 0; i < length; i++) {
            var exists = false;
            for (var j = 0; j < length; j++) {
                if ((compareItems || ((a, b) => a === b))(a[i], b[j])) {
                    exists = true;
                }
            }
            if (!exists) {
                return false;
            }
        }
        return true;
    }
}
