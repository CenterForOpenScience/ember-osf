// Test cases shared by the family of "special character" fixer functions.
const fixStringTestCases = [
    ['a regular string', 'a regular string'],
    ['multiple &amp; sequences all become &amp;', 'multiple & sequences all become &'],
    ['', ''],
    ['for now, intentionally limit which characters are fixed &amp; &lt; &gt;', 'for now, intentionally limit which characters are fixed & &lt; &gt;'],
    [null, null]
];

export { fixStringTestCases };
