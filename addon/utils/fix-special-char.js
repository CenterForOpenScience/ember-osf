export default function fixSpecialChar(inputString) {
    return inputString ? inputString.replace(/&amp;/g, '&') : inputString;
}

export { fixSpecialChar };
