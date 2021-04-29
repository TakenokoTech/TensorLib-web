const path = require("path");

module.exports = {
    mode: "development",
    // mode: "production",
    entry: "./TensorLib/src/Firearm.ts",
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
        extensions: [".ts", ".js"]
    }
};