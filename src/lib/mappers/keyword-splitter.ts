/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import keyword_mapper from "./keyword-mapper";

/**
 * Split keyword and conditionally map its parts.
 */

const keyword_splitter: (keyphrase: string) => string = (
    keyphrase: string,
): string => {
    return keyphrase
        .split(",")
        .map((item: string): string => {
            return item.includes("'") || item.includes('"')
                ? item
                : keyword_mapper(item.toLowerCase());
        })
        .join(" ")
        .replaceAll(";", ", ");
};

/**
 * Export above function.
 */

export default keyword_splitter;
