/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import continuum_keywords_mapping from "../keywords-mapping";

/**
 * Map Continuum keyword to CSS keyword.
 */

const keyword_mapper: (keyword: string) => string = (
    keyword: string,
): string => {
    const normalised_keyword: string[] = keyword
        .replace(/[\W_]+/g, "-")
        .split("-");

    normalised_keyword
        .map((item: string): string => {
            return continuum_keywords_mapping[item] ?? item;
        })
        .forEach((item: string, index: number): undefined => {
            keyword = keyword.includes(item)
                ? keyword
                : keyword.replace(normalised_keyword[index], item);

            return;
        });

    return keyword;
};

/**
 * Export above function.
 */

export default keyword_mapper;
