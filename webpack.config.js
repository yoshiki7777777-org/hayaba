var path = require('path')
var webpack = require('webpack')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WorkboxWebpackPlugin = require('workbox-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin');

var config = {
    build: {
        assetsRoot:path.resolve(__dirname, './dist')
    }
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: config.build.assetsRoot,
        // publicPath: '/',
        filename: '[hash].main.js'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ],
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src/'),
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        // hints: 'warning'
    },
    devtool: '#eval-source-map'
}

module.exports.plugins = [
    new CleanWebpackPlugin([config.build.assetsRoot]),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: "./src/index.html",
    })
];

process.env.DEBUG = process.env.DEBUG || false;
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: '"production"'
        //     }
        // }),
        new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.AggressiveMergingPlugin(),
        // new webpack.optimize.OccurrenceOrderPlugin(true),
        new LodashModuleReplacementPlugin({

        }),
        // new WorkboxWebpackPlugin.InjectManifest({
        //     // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
        //     swSrc: path.join(__dirname, 'src/service-worker.js'),
        //     swDest: path.join(config.build.assetsRoot, 'service-worker.js'),
        //     include: [/\.html$/, /\.js$/],
        // })
        new WorkboxWebpackPlugin.GenerateSW({
            // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
            swDest: path.join(config.build.assetsRoot, 'service-worker.js'),
            clientsClaim: true,
            skipWaiting: true,
        }),
    ])
}
