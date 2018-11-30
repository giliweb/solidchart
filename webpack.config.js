const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        'bundle.js': __dirname + '/src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]',
        library: 'SolidChart',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'inline-source-map',
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader'
            }
        ]
    }
};