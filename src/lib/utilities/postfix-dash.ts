/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Postfixes dashes to item until unique.
 */

const postfix_dash: (item: string, items: string[]) => string = (
    item: string,
    items: string[],
): string => {
    return items.includes(item) ? postfix_dash(`${item}-`, items) : item;
};

/**
 * Export above function.
 */

export default postfix_dash;
