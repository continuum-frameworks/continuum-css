/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Split item to separate values from value-functions.
 */

const value_splitter: (item: string) => string[] = (item: string): string[] => {
    const count: number = item.length;

    let temporary: string = "";

    let in_quotes: boolean = false;

    let in_parentheses: number = 0;

    const result: string[] = [];

    for (let index: number = 0; index < count; index++) {
        const character: string = item[index];

        if (character === ";" && !in_quotes && in_parentheses === 0) {
            result.push(temporary);

            temporary = "";
        } else if (character === "," && !in_quotes && in_parentheses === 0) {
            result.push(temporary);

            temporary = "";
        } else {
            temporary += character;

            if (character === '"') {
                in_quotes = !in_quotes;
            }

            if (character === "(") {
                in_parentheses++;
            }

            if (character === ")") {
                in_parentheses--;
            }
        }
    }

    if (temporary) {
        result.push(temporary);
    }

    return result;
};

/**
 * Export above function.
 */

export default value_splitter;
