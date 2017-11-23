var path = require('path');
module.exports = {
    entry: {
        Class: path.join(__dirname, 'src/index.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'Class.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    }
};
