const {resolve} = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');
const {IS_DEV, PROJECT_ROOT} = require('./env');

module.exports = {
    entry: {
        index: resolve(PROJECT_ROOT, './src/js/index.tsx')
    },
    output: {
        path: resolve(PROJECT_ROOT, './build'),
        publicPath: '/',
        filename: '[name].[hash].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: ['awesome-typescript-loader'],
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
                    IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                    IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
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
                                    'primary-color': '#09d0db',
                                    'link-color': '#09d0db',
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
        new WebpackBar({
            color: IS_DEV ? "#fff300" : "#00fff7",
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new FriendlyErrorsPlugin(),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(PROJECT_ROOT, './public'),
                    to: resolve(PROJECT_ROOT, './build'),
                    force: true
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: resolve(PROJECT_ROOT, './src/html/index.ejs'),
            filename: 'index.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: true
            }
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        mainFiles: ["index"],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    }
}