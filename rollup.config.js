import babel from "@rollup/plugin-babel";
import command from 'rollup-plugin-command';
import filesize from "rollup-plugin-filesize";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import sourcemaps from "rollup-plugin-sourcemaps";
import {terser} from "rollup-plugin-terser";

export default (args) => {
    const watch = !!args.watch;

    const pluginsDev = [
        command("npm run start", {once: true}),
        livereload(["dist", "example"]),
    ];
    const pluginsProd = [
        terser(),
    ];

    return [
        {
            input: "src/less/material.less",
            output: {
                dir: "dist/css",
            },
            plugins: [
                postcss({
                    inject: false,
                    extract: "material.css",
                    sourceMap: true,
                    minimize: !watch,
                }),
            ],
            watch: {
                clearScreen: false,
            },
        },
        {
            input: "src/js/index.js",
            output: {
                sourcemap: true,
                file: "dist/umd/regular-table.js",
            },
            plugins: [
                babel({
                    exclude: "node_modules/**",
                    babelHelpers: "bundled",
                }),
                filesize(),
                postcss({
                    inject: false,
                    sourceMap: watch,
                    minimize: !watch,
                }),
                sourcemaps(),
                ...(watch ? pluginsDev : pluginsProd),
            ].filter((x) => x),
            watch: {
                clearScreen: false,
            },
        },
    ];
};
