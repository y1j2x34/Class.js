var babel = require('rollup-plugin-babel');
var browsersync = require('rollup-plugin-browsersync');
var fillhtml = require('rollup-plugin-fill-html');
var copy = require('rollup-plugin-copy');
var path = require('path');
var uglify = require('rollup-plugin-uglify');


module.exports = {
    input: 'src/index.js',
    output: {
        file: path.join('./serve', 'Class.min.js'),
        format: 'umd',
        name: 'Class',
        sourcemap: true
    },
    watch: {
        include: ['src/**/*.js', 'debug/**/*', 'dev/**/*'],
        exclude: ['node_modules/**']
    },
    plugins: [
        browsersync({
            server: './serve',
            port: 8967,
            open: false,
            watch: './',
            logLevel: 'debug'
        }),
        copy({
            'dev/index.js': 'serve/index.js'
        }),
        babel(),
        uglify(),
        fillhtml({
            template: 'dev/index.html',
            filename: 'index.html',
            externals: [
                {type: 'js', file: 'index.js', pos: 'after'}
            ]
        })
    ]
};