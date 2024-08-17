/**
 * Copyright (c) Michael K Macharia.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/**
 * Import relevant modules.
 */

import postfix_dash from "./lib/utilities/postfix-dash";
import swap_substring from "./lib/utilities/swap-substring";
import unswap_substring from "./lib/utilities/unswap-substring";
import parse_property from "./lib/parsers/parse-property";
import parse_value from "./lib/parsers/parse-value";
import parse_value_function from "./lib/parsers/parse-value-function";
import parse_at_rule from "./lib/parsers/parse-at-rule";
import parse_pseudo_class from "./lib/parsers/parse-pseudo-class";
import parse_pseudo_element from "./lib/parsers/parse-pseudo-element";

/**
 * Always run as soon as possible.
 */

Array.from(document.getElementsByTagName("style")).forEach(
    (element: HTMLStyleElement): undefined => {
        if (element.getAttribute("type") === "text/continuum-css") {
            element.innerText = element.innerText
                .replace(
                    /\b[a-zA-Z]\d{3}\b(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/g,
                    (match: string): string => {
                        return parse_value(match);
                    },
                )
                .replace(/^'|'$/g, '"')
                .replace(/(?<!!)_/g, " ")
                .replace(/!_/g, "_");

            element.setAttribute("type", "text/css");
        }

        return;
    },
);

/**
 * Only run after page has completely loaded all assets.
 */

window.onload = (event: Event): undefined => {
    /**
     * List class names.
     */

    const elements: Element[] = [];

    const class_names: string[] = [];

    const updated_class_names: string[] = [];

    document
        .querySelectorAll("[class]")
        .forEach((element: Element): undefined => {
            if (element.classList.length) {
                elements.push(element);

                element.className
                    .toString()
                    .split(/\s+/)
                    .forEach((class_name: string): undefined => {
                        if (class_name && !class_names.includes(class_name)) {
                            class_names.push(class_name);

                            updated_class_names.push(
                                `${postfix_dash(
                                    class_name
                                        .toLowerCase()
                                        .replace(/[\W_]+/g, "-"),
                                    updated_class_names,
                                )}`,
                            );
                        }

                        return;
                    });
            }

            return;
        });

    /**
     * Interpret class names.
     */

    const at_rules: { [key: string]: string } = {
        charset: "",
        import: "",
        namespace: "",
        color_profile: "",
        container: "",
        document: "",
        media: "",
        scope: "",
        starting_style: "",
        supports: "",
        font_feature_values: "",
        counter_style: "",
        font_face: "",
        font_palette_values: "",
        keyframes: "",
        layer: "",
        page: "",
        property: "",
    };

    const swapped_substrings: { [key: string]: string } = {};

    const interpreted_class_names: { [key: string]: string }[] =
        class_names.map((class_name: string): { [key: string]: string } => {
            let property: string,
                value: string,
                value_function: string,
                at_rule: string,
                pseudo_class: string,
                pseudo_element: string;

            class_name = swap_substring(class_name, swapped_substrings);

            if (class_name[0] === "@") {
                at_rule = class_name.slice(1);
            } else {
                [property, value] = class_name.split("=");

                [property, at_rule] = property.includes("@")
                    ? property
                          .split("@")
                          .fill(property.split("@").slice(1).join("@"), 1)
                    : [property, at_rule];

                [property, pseudo_element] = property.includes("::")
                    ? property.split("::")
                    : [property, pseudo_element];

                [property, pseudo_class] = property.includes(":")
                    ? property
                          .split(":")
                          .fill(property.split(":").slice(1).join(":"), 1)
                    : [property, pseudo_class];

                [at_rule, pseudo_element] =
                    at_rule && at_rule.includes("::")
                        ? at_rule.split("::")
                        : [at_rule, pseudo_element];

                [at_rule, pseudo_class] =
                    at_rule && at_rule.includes(":")
                        ? at_rule.split(":")
                        : [at_rule, pseudo_class];

                [value_function, value] = value
                    ? value.includes("(")
                        ? [`${value}`, undefined]
                        : [value_function, value]
                    : [value_function, "i631"];
            }

            property = property
                ? parse_property(unswap_substring(property, swapped_substrings))
                : property;

            value = value
                ? parse_value(unswap_substring(value, swapped_substrings))
                : value;

            value_function = value_function
                ? parse_value_function(
                      unswap_substring(value_function, swapped_substrings),
                  )
                : value_function;

            at_rule = at_rule
                ? parse_at_rule(
                      unswap_substring(at_rule, swapped_substrings),
                      at_rules,
                  )
                : at_rule;

            pseudo_class = pseudo_class
                ? parse_pseudo_class(
                      unswap_substring(pseudo_class, swapped_substrings),
                  )
                : pseudo_class;

            pseudo_element = pseudo_element
                ? parse_pseudo_element(
                      unswap_substring(pseudo_element, swapped_substrings),
                  )
                : pseudo_element;

            return {
                property: property,
                value: value,
                value_function: value_function,
                at_rule: at_rule,
                pseudo_class: pseudo_class,
                pseudo_element: pseudo_element,
            };
        });

    /**
     * Generate implemented styles.
     */

    const generated_styles: string[] = interpreted_class_names.map(
        (
            interpreted_class_name: { [key: string]: string },
            index: number,
        ): string => {
            return interpreted_class_name["property"]
                ? `.${updated_class_names[index]}${
                      interpreted_class_name["pseudo_class"] ?? ""
                  }${interpreted_class_name["pseudo_element"] ?? ""}{${
                      interpreted_class_name["property"]
                  }:${
                      interpreted_class_name["value"] ??
                      interpreted_class_name["value_function"]
                  };}`
                : "";
        },
    );

    generated_styles.unshift(
        at_rules.charset.split(";").slice(-2).join(";"),
        at_rules.import,
        at_rules.namespace,
        at_rules.color_profile,
        at_rules.container,
        at_rules.document,
        at_rules.media,
        at_rules.scope,
        at_rules.supports,
        at_rules.font_feature_values,
        at_rules.counter_style,
        at_rules.font_face,
        at_rules.font_palette_values,
        at_rules.keyframes,
        at_rules.layer,
        at_rules.page,
        at_rules.property,
    );

    generated_styles.push(at_rules.starting_style);

    /**
     * Insert generated styles.
     */

    const style: HTMLStyleElement = document.createElement("style");

    style.setAttribute("type", "text/css");

    style.appendChild(document.createTextNode(generated_styles.join("")));

    document.head.appendChild(style);

    /**
     * Update class names.
     */

    class_names.forEach((class_name: string, index: number): undefined => {
        elements.forEach((element: Element): undefined => {
            if (element.classList.contains(class_name)) {
                element.classList.replace(
                    class_name,
                    updated_class_names[index],
                );
            }

            return;
        });

        return;
    });

    /**
     * Remove cc-wait attributes.
     */

    document.querySelectorAll("*").forEach((element: Element): undefined => {
        element.removeAttribute("cc-wait");

        return;
    });

    return;
};
