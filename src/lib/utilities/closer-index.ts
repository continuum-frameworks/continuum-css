/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Locate index of closing parenthesis or square-bracket.
 */

const closer_index: (item: string, target: string) => number = (
    item: string,
    target: string,
): number => {
    const closer: { [key: string]: string } = {
        "(": ")",
        "[": "]",
    };

    const count: number = item.length;

    let point: number = 1;

    for (let index: number = item.indexOf(target) + 1; index < count; index++) {
        if (item[index] === target) {
            point++;
        } else if (item[index] === closer[target]) {
            point--;

            if (point === 0) {
                return index;
            }
        }
    }

    return -1;
};

/**
 * Export above function.
 */

export default closer_index;
