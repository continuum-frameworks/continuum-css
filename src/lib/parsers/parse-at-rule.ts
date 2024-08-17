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
import closer_index from "../utilities/closer-index";
import reverse_string from "../utilities/reverse-string";
import parse_value_function from "./parse-value-function";
import unclosed_parenthesis from "../utilities/unclosed-parenthesis";
import value_splitter from "../utilities/value-splitter";
import parse_value from "./parse-value";

/**
 * Parse specified CSS at-rule.
 */

const parse_at_rule: (
    at_rule: string,
    at_rules: { [key: string]: string },
    return_result?: boolean,
) => string = (
    at_rule: string,
    at_rules: { [key: string]: string },
    return_result: boolean = false,
): string => {
    const at_rule_key: string = at_rule.split(/[^-0-9a-zA-Z]+/)[0];

    const at_rule_other: string = at_rule.slice(
        at_rule_key.length,
        at_rule.length,
    );

    const at_rule_name: string = parse_property(
        at_rule_key === ""
            ? at_rule_other.slice(
                  0,
                  at_rule_other.length -
                      closer_index(reverse_string(at_rule_other), "[") -
                      1,
              )
            : at_rule_key,
    );

    const ignore_items: string[] = [];

    let absorbed_items: string = "";

    const outer_items: { [key: string]: string } = {
        prefix: "",
        postfix: "",
    };

    const at_rule_ = `${
        at_rule_name === "" ? "" : `@${at_rule_name}`
    } ${parse_value_function(
        at_rule_other.slice(
            at_rule_other.indexOf("("),
            at_rule_other.indexOf(")[") + 1,
        ),
    ).replace(/^\(|\)$/g, "")}{${at_rule_other
        .slice(at_rule_other.indexOf("["), at_rule_other.lastIndexOf("]") + 1)
        .split(/,(?![^\[\]]*\])/g)
        .map((item: string, index: number, items: string[]): string => {
            if (item.includes("@")) {
                const nested_at_rule: string = at_rule_other.slice(
                    at_rule_other.indexOf("@") + 1,
                    at_rule_other.indexOf("@") +
                        closer_index(
                            at_rule_other.slice(at_rule_other.indexOf("@")),
                            "[",
                        ) +
                        1,
                );

                nested_at_rule
                    .split(/,(?![^\[\]]*\])/g)
                    .slice(1)
                    .forEach((item: string): undefined => {
                        ignore_items.unshift(item);

                        return;
                    });

                return parse_at_rule(nested_at_rule, at_rules, true);
            }

            if (
                ignore_items.includes(item) ||
                ignore_items.includes(item.slice(0, item.length - 1))
            ) {
                ignore_items.pop();

                return "";
            }

            if (item.slice(-1) !== "]") {
                items[index + 1] = `${item},${items[index + 1]}`;

                return "";
            }

            if (absorbed_items.startsWith(item)) {
                absorbed_items = absorbed_items.replace(item, "");

                return "";
            }

            let no_selector: boolean = false;

            if (item.includes("$[")) {
                const index_ = closer_index(
                    item.slice(item.indexOf("$[")),
                    "[",
                );

                let outer_items_: string = parse_at_rule(
                    item.slice(
                        item.indexOf("$[") + 1,
                        item.indexOf("$[") + index_ + 1,
                    ),
                    at_rules,
                    true,
                );

                outer_items_ = outer_items_.slice(
                    outer_items_.indexOf("{") + 1,
                    outer_items_.lastIndexOf("}"),
                );

                outer_items.prefix = outer_items_.slice(0, -1);

                outer_items.postfix = outer_items_.slice(-1);

                item = `[${item.slice(index_ + 2)}`.replaceAll("[,", "[");

                no_selector = true;
            }

            const base_selector: string = item.slice(
                /^\[/.test(item) ? 1 : 0,
                item.length -
                    closer_index(
                        reverse_string(item.replace(/^\[|\]$/g, "_")),
                        "[",
                    ) -
                    1,
            );

            let selector: string = no_selector
                ? ""
                : parse_value_function(base_selector)
                      .replace(/^\(|\)$/g, " ")
                      .trim();

            selector =
                (selector.includes("]") &&
                    closer_index(reverse_string(selector), "[") === -1) ||
                (selector.slice(-1) === "=" && !selector.includes("["))
                    ? ""
                    : selector.includes("[") &&
                      closer_index(selector, "[") === -1
                    ? selector.slice(0, selector.indexOf("["))
                    : selector.includes("(") &&
                      closer_index(selector, "(") === -1
                    ? selector.replace("(", " ")
                    : selector;

            let nested_selector: string = item
                .replace(/^\[|\]$/g, "")
                .replace(`${base_selector}[`, "");

            if (/[^=]\[/g.test(nested_selector)) {
                while (true) {
                    if (closer_index(nested_selector, "[") !== -1) {
                        break;
                    }

                    nested_selector += items[index + 1];
                }

                const closer: number = closer_index(nested_selector, "[");

                if (nested_selector.length !== closer + 1) {
                    nested_selector = nested_selector.slice(0, closer + 1);

                    absorbed_items += nested_selector;
                }

                nested_selector = parse_at_rule(nested_selector, at_rules, true)
                    .replace(/^\@/g, "")
                    .replaceAll(" {", "{");
            } else {
                nested_selector = "";
            }

            return `${selector}${selector === "" ? "" : "{"}${
                nested_selector === ""
                    ? item
                          .match(/(\w+-?\w*)=\s*(?:\[[^\]]*\]|[^,\]]*)/g)
                          .map((item_: string): string => {
                              item_ = unclosed_parenthesis(item_)
                                  ? `${item_}${item.slice(
                                        item.indexOf(item_) + item_.length,
                                        closer_index(item, "(") + 1,
                                    )}`
                                  : item_;

                              item = item.replace(item_, "");

                              const item_property: string =
                                  item_.split(/[^-0-9a-zA-Z]+/)[0];

                              const item_property_value: string = item_
                                  .slice(item_property.length + 1)
                                  .match(/([^\[\]]+)/g)[0];

                              let items_: string = "";

                              return `${parse_property(
                                  item_property,
                              )}:${value_splitter(item_property_value)
                                  .map((item__: string): string => {
                                      items_ += item__;

                                      const delimeter: string =
                                          item_property_value.slice(
                                              items_.length,
                                              items_.length + 1,
                                          );

                                      if ([",", ";"].includes(delimeter)) {
                                          item__ += delimeter;

                                          items_ += delimeter;
                                      }

                                      return item__.includes("(")
                                          ? parse_value_function(item__)
                                          : parse_value(item__);
                                  })
                                  .join("")};`;
                          })
                          .join("")
                    : nested_selector
            }${selector === "" ? "" : "}"}`;
        })
        .join("")}}`.replace(/\{\}$/g, ";");

    at_rule = `${outer_items.prefix}${
        at_rule_ === `@${at_rule_name} ;`
            ? `@${at_rule_name} ${parse_value_function(at_rule_other).replace(
                  /^\(|\)$/g,
                  "",
              )};`
            : at_rule_
    }${outer_items.postfix}`;

    at_rules[at_rule_name.replaceAll("-", "_")] += return_result ? "" : at_rule;

    return return_result ? at_rule : "";
};

/**
 * Export above function.
 */

export default parse_at_rule;
