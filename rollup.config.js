import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

// browser-friendly UMD build
const umdBaseConfig = {
    input: 'src/index.ts',
    output: {
        name: 'trui',
        file: pkg.browser,
        format: 'umd',
        globals: {
            // define global names for external dependencies
            'roslib': 'ROSLIB',
            'socket.io-client': 'io',
        }
    },
    plugins: [
        autoExternal(), // so Rollup knows what dependencies are external
        resolve(), // so Rollup can find dependencies like roslib and socket.io-client
        commonjs(), // so Rollup can convert the dependencies to an ES module
        typescript(), // so Rollup can convert TypeScript to JavaScript
    ]
};

const umdConfigMinifed = {
    ...umdBaseConfig,
    plugins: [
        ...umdBaseConfig.plugins,
        production && terser() // minify transpiled code 
    ]
};

const config = [
    // generate an unminified version of the umd build
    {
        ...umdBaseConfig,
        output: {
            ...umdBaseConfig.output,
            file: pkg.browser.replace('.min', ''),
        },
    },
    // generate a minified umd version if we are building for production
    production && umdConfigMinifed,

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify 
    // `file` and `format` for each target)
    {
        input: 'src/index.ts',
        plugins: [
            autoExternal(), // so Rollup knows what dependencies are external
            typescript(), // so Rollup can convert TypeScript to JavaScript
            production && terser() // minify transpiled code 
        ],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' }
        ]
    }
];

export default config;