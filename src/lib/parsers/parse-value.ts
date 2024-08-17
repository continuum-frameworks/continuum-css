/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import parse_property from "./parse-property";

/**
 * Parse specified CSS value.
 */

const parse_value: (value: string) => string = (value: string): string => {
    return /^(['"])(?:(?!\1).)*\1$/.test(value)
        ? value
              .replace(/^'|'$/g, '"')
              .replace(/(?<!!)_/g, " ")
              .replace(/!_/g, "_")
        : parse_property(value);
};

/**
 * Export above function.
 */

export default parse_value;
