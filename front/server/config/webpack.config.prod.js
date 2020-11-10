const {resolve} = require('path');
const {merge} = require('webpack-merge');
const baseCfg = require('./webpack.config');
const {HashedModuleIdsPlugin} = require('webpack');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {PROJECT_ROOT} = require('./env');

module.exports = merge(baseCfg, {
    mode: 'production',
    plugins: [
        new HashedModuleIdsPlugin({
            context: resolve(PROJECT_ROOT, './src'),
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        })
    ],
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
});