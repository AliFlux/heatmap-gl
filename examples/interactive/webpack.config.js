const path = require('path');

module.exports = {
    entry: './index.js',
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
};