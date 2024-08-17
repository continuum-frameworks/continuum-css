/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import parse_pseudo_class from "./parse-pseudo-class";

/**
 * Parse specified CSS pseudo-element.
 */

const parse_pseudo_element: (pseudo_element: string) => string = (
    pseudo_element: string,
): string => {
    return `:${parse_pseudo_class(pseudo_element)}`;
};

/**
 * Export above function.
 */

export default parse_pseudo_element;
