var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: [
        "./Scripts/app/boot/Boot.tsx"
    ],
    output: {
        path: path.join(__dirname, 'Scripts/dist'),
        filename: 'bundle.js',
        /*publicPath: '/static/'*/
    },
        resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loaders: ["ts-loader"],
                include: path.join(__dirname, 'Scripts/app')
            }
        ]
    }
};
