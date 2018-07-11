var strip = require('rollup-plugin-strip');
var babel = require('rollup-plugin-babel');
var path = require('path');
var uglify = require('rollup-plugin-uglify');
var stripOptions = require('./rollup-strip.config');

module.exports = {
    input: 'src/index.js',
    output: {
        file: path.join('./dist', 'Class.min.js'),
        format: 'umd',
        name: 'Class',
        sourcemap: true
    },
    plugins: [
        strip(stripOptions),
        babel(),
        uglify()
    ]
};