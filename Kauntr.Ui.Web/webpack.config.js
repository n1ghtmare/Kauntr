var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: [
        "webpack-hot-middleware/client",
        "./Scripts/app/boot/App.tsx"
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/static/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

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
                loaders: ["react-hot-loader", "ts-loader"],
                include: path.join(__dirname, "Scripts/app")
            },
            {
                test: /\.js$/, enforce: "pre", loader: "source-map-loader"
            }
        ],
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    //externals: {
    //    "react": "React",
    //    "react-dom": "ReactDOM"
    //}
};
