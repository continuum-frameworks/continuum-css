/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Un-swap substrings with unique IDs.
 */

const unswap_substring: (
    item: string,
    items: { [key: string]: string },
) => string = (item: string, items: { [key: string]: string }): string => {
    Object.entries(items).forEach((items: string[]): undefined => {
        item = item.replace(items[0], items[1]);

        return;
    });

    return item;
};

/**
 * Export above function.
 */

export default unswap_substring;
