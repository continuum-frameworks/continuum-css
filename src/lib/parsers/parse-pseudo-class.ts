/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import parse_value from "./parse-value";
import parse_value_function from "./parse-value-function";

/**
 * Parse specified CSS pseudo-class.
 */

const parse_pseudo_class: (pseudo_class: string) => string = (
    pseudo_class: string,
): string => {
    return `:${
        pseudo_class.includes("(")
            ? parse_value_function(pseudo_class).replaceAll("()", ")")
            : parse_value(pseudo_class)
    }`;
};

/**
 * Export above function.
 */

export default parse_pseudo_class;
