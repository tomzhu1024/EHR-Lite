const {resolve} = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const {HotModuleReplacementPlugin} = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {HashedModuleIdsPlugin} = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
    entry: {
        index: resolve(__dirname, 'src/js/index.jsx')
    },
    output: {
        publicPath: '/',
        path: resolve(__dirname, 'build'),
        filename: '[name].[hash].bundle.js'
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: 9000,
        hot: true,
        quiet: true,
        stats: false,
        writeToDisk: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            'babel-plugin-lodash',
                            'react-hot-loader/babel',
                            ['@babel/plugin-proposal-decorators', {legacy: true}],
                            ['@babel/plugin-proposal-class-properties', {loose: true}],
                            ['babel-plugin-import', {libraryName: 'antd'}]
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|woff2?)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            esModule: false,
                            limit: 0
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                modifyVars: {
                                    'primary-color': '#3835d0',
                                    'link-color': '#3835d0',
                                },
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new WebpackBar({
            name: 'Compiling',
            color: '#00fff7'
        }),
        new FriendlyErrorsPlugin(),
        new MiniCssExtractPlugin(),
        new HashedModuleIdsPlugin({
            context: resolve(__dirname, 'src'),
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        }),
        new LodashModuleReplacementPlugin,
        new AntdDayjsWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(__dirname, 'public'),
                    to: resolve(__dirname, 'build'),
                    force: true
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'src/html/index.ejs'),
            filename: 'index.html',
            chunks: ['index'],
            title: 'Index Page',
            minify: {
                collapseWhitespace: true
            }
        })
    ],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'async'
        }
    },
    performance: {
        hints: false
    }
}