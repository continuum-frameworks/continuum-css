const path = require("path");

module.exports = {
    entry: { "cdn.min.js": "./src/continuum-css.ts" },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        clean: {
            keep: "index.html",
        },
        filename: "[name]",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts"],
    },
    stats: {
        children: true,
    },
};
