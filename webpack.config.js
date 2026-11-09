const path = require('path');

module.exports = {
    entry: './main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        fs: 'empty' // To handle the 'fs' module
    }
};