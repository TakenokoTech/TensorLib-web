const path = require("path");
const copy = require('copy-webpack-plugin');

module.exports = {
    mode: "development",
    devtool: 'inline-source-map',
    entry: "./TensorLib/src/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "tensor-lib.js",
        library: "TensorLib",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts(x*)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: { configFile: "tsconfig.json" }
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {"os": require.resolve("os-browserify/browser")}
    },
    plugins: [
        new copy({
            patterns:[{
                from: `${__dirname}/node_modules/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm`,
                to: `${__dirname}/dist`,
            }]
        }),
        new copy({
            patterns:[{
                from: `${__dirname}/sample`,
                to: `${__dirname}/dist`,
            }]
        }),
    ]
};