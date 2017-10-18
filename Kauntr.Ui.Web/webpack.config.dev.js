var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: [
        "react-hot-loader/patch",
        "webpack-hot-middleware/client",
        "./Scripts/app/boot/Boot.tsx"
    ],
    output: {
        path: path.join(__dirname, "Scripts/dist"),
        filename: "bundle.js",
        publicPath: "/static/"
    },

    // Enable sourcemaps for debugging webpack's output.
//    devtool: "source-map",
    devtool: "eval",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/)
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: ["react-hot-loader/webpack", "ts-loader"],
                exclude: path.resolve(__dirname, "node_modules"),
                include: path.join(__dirname, "Scripts/app")
            },
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader"
            }
        ]
    }
};
