/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import keyword_splitter from "../mappers/keyword-splitter";

/**
 * Parse specified CSS property.
 */

const parse_property: (property: string) => string = (
    property: string,
): string => {
    return keyword_splitter(property);
};

/**
 * Export above function.
 */

export default parse_property;
