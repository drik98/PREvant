/**
 * Sort an array of objects by a specific string property alphabetically,
 * ignoring case, with a specific keyword (e.g., "latest") always at the top.
 *
 * The (main) use case for this is to sort the apps by their name so that the most important
 * app is always at the front and the remaining apps are sorted alphabetically.
 *
 * @param {Array<{ name: string }>} arr - The array to sort.
 * @param {string} property - The object property to sort by.
 * @param {string} keyword - The special keyword to keep at the top (case-insensitive).
 * @returns {Array<{ name: string }>} A new sorted array (original is not mutated).
 */
export function sortByPropertyWithKeywordFirst(arr, property, keyword) {
  const lowercasedKeyword = keyword?.toLocaleLowerCase();

  return [...arr].sort((a, b) => {
    const valueA = a[property] ?? "";
    const valueB = b[property] ?? "";

    // Handle keyword: push it to the beginning
    if (valueA.toLocaleLowerCase() === lowercasedKeyword) return -1;
    if (valueB.toLocaleLowerCase() === lowercasedKeyword) return 1;

    // Handle missing or empty values: push them to the end
    if (!valueA && valueB) return 1;
    if (!valueB && valueA) return -1;

    return valueA.localeCompare(valueB, undefined, { sensitivity: "base" });
  });
}
