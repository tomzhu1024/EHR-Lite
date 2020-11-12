const {argv} = require('yargs');
const {resolve} = require('path');

module.exports = {
    IS_DEV: argv.mode !== 'production',
    PROJECT_ROOT: resolve(__dirname, './../../')
};