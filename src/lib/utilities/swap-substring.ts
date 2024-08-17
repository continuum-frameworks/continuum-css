/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Swap substrings with unique IDs.
 */

const swap_substring: (
    item: string,
    items: { [key: string]: string },
) => string = (item: string, items: { [key: string]: string }): string => {
    return item.replace(/(['"])(.*?)\1/g, (match: string): string => {
        const unique_id: string = `UNIQUE_ID_${Math.random()
            .toString(36)
            .slice(2, 11)}`;

        items[unique_id] = match;

        return `${unique_id}`;
    });
};

/**
 * Export above function.
 */

export default swap_substring;
