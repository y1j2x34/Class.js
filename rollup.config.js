var strip = require('rollup-plugin-strip');
var babel = require('rollup-plugin-babel');
var path = require('path');
var uglify = require('rollup-plugin-uglify');
var stripOptions = require('./rollup-strip.config');
var name = 'Class.min.js';

module.exports = {
    input: 'src/index.js',
    output: {
        file: path.join('./dist', name),
        format: 'umd',
        name: name,
        sourcemap: true
    },
    plugins: [
        strip(stripOptions),
        babel(),
        uglify()
    ]
};