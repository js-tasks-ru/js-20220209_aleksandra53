/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const symbols = string.split('');
  return symbols.filter((symbol, index) => {
    if (size === 0) return false;
    if (!size || index < size) return true;

    for (let indexToCheck = index - 1; index - indexToCheck <= size; indexToCheck--) {
      if (symbols[indexToCheck] !== symbol) return true;
    }

    return symbols[index - size] !== symbol;
  }).join('');
}
