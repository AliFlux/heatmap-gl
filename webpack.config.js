const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'heatmap-gl.js',
        library: {
            name: 'heatmap-gl',
            type: 'umd',
        },
    },
};