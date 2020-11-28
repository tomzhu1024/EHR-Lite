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
        patient: resolve(PROJECT_ROOT, 'src/js/patient-app.tsx')
    },
    output: {
        path: resolve(PROJECT_ROOT, 'build'),
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
            color: IS_DEV ? '#fff300' : '#00fff7',
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new FriendlyErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: resolve(PROJECT_ROOT, 'src/html/template.ejs'),
            filename: 'patient.html',
            chunks: ['patient'],
            minify: {
                collapseWhitespace: true
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    }
}