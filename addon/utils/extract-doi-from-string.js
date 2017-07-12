export default function extractDoiFromString(doi) {
    // Attempts to Extracts a DOI from a string.
    // For example, given "https://dx.doi.org/10.12345/hello" returns "10.12345/hello"
    // If no DOI is found, the original string is returned.
    const doiRegex = /\b(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?!["&\'<>])\S))\b/;
    if (doi) {
        const doiOnly = doiRegex.exec(doi);
        return doiOnly !== null ? doiOnly[0] : doi;
    }
    return doi;
}
