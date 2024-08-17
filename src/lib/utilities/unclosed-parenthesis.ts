/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Check if the item contains unclosed parenthesis.
 */

const unclosed_parenthesis: (item: string) => boolean = (
    item: string,
): boolean => {
    return !!(item.match(/\([^)]*$/) || item.match(/\([^)]*\)$/));
};

/**
 * Export above function.
 */

export default unclosed_parenthesis;
