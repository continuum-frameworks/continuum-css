/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Mirror the specified string along the x-axis.
 */

const reverse_string: (item: string) => string = (item: string): string => {
    const non_alphanumeric: { [key: string]: string } = {
        "(": ")",
        ")": "(",
        "[": "]",
        "]": "[",
    };

    return item
        .split("")
        .reverse()
        .map((item: string): string => {
            return item.replace(/[\(\)\[\]]/g, (match: string): string => {
                return non_alphanumeric[match];
            });
        })
        .join("");
};

/**
 * Export above function.
 */

export default reverse_string;
