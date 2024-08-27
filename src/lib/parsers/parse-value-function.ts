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
 * Parse specified CSS value-function.
 */

const parse_value_function: (value_function: string) => string = (
    value_function: string,
): string => {
    return `${value_function
        .split("(")[0]
        .split(";")
        .map((item: string, index: number, items: string[]): string => {
            return parse_property(
                `${item}${index === items.length - 1 ? "" : ";"}`,
            );
        })
        .join("")}${value_function.includes("(") ? "(" : ""}${parse_property(
        value_function
            .split("(")
            .slice(1)
            .join("(")
            .split(";")
            .map((item: string): string => {
                return item.includes("(")
                    ? `${parse_value_function(item.split(")")[0])}${
                          item.split(")").length === 1 ? "" : ")"
                      }${item.split(")").slice(1).join(")")}`
                    : item;
            })
            .join(";"),
    ).replace(/(\/)(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/g, " / ")}`.replace(
        /calc\(([^)]+)\)/g,
        (_match: string, args: string): string => {
            return `calc(${args.replace(/(\s*[\+\-\*\/]\s*)/g, " $1 ")})`;
        },
    );
};

/**
 * Export above function.
 */

export default parse_value_function;
