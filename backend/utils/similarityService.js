import stringSimilarity from 'string-similarity';

/**
 * Calculates the similarity score between two text strings.
 */
export const compareText = (source, target) => {
    return stringSimilarity.compareTwoStrings(source, target);
};

/**
 * Finds the best matching snippet and its score from the target text.
 */
export const findBestMatchSnippet = (source, target, windowSize = 100) => {
    const score = compareText(source, target);
    const snippet = target.substring(0, windowSize) + (target.length > windowSize ? '...' : '');

    return { score, snippet };
};