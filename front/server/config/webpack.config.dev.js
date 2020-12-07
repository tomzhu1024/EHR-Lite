const {resolve} = require('path');
const {merge} = require('webpack-merge');
const baseCfg = require('./webpack.config');
const {HotModuleReplacementPlugin} = require('webpack');
const {PROJECT_ROOT} = require('./env');

module.exports = merge(baseCfg, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: resolve(PROJECT_ROOT, 'build'),
        port: 9000,
        hot: true,
        writeToDisk: true,
        quiet: true,
    },
    plugins: [
        new HotModuleReplacementPlugin(),
    ]
});