'use strict';
module.exports = function(config) {
    var strip = require('rollup-plugin-strip');
    var babel = require('rollup-plugin-babel');
    var stripOptions = require('./rollup-strip.config');

    var reporters = ['kjhtml', 'coverage'];
    var coverageReporters = [
        {
            type: 'text-summary'
        }
    ];
    if (process.env.TRAVIS) {
        console.log('On Travis sending coveralls');
        coverageReporters.push({
            type: 'lcov',
            dir: 'coverage.es6'
        });
        reporters.push('coveralls');
    } else {
        console.log('Not on Travis so not sending coveralls');
        coverageReporters.push({
            type: 'html',
            dir: 'coverage.es6'
        });
    }
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        restartBrowserBetweenTests: false,

        files: [
            './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
            {
                pattern: 'spec/main.js',
                watched: true,
                included: true,
                served: true
            },
            {
                pattern: 'src/*.js',
                watched: true,
                included: false,
                served: true
            },
            {
                pattern: '**/*.map',
                watched: false,
                included: false,
                served: true
            }
        ],
        preprocessors: {
            './node_modules/babel-runtime/core-js/**/*.js': ['rollup'],
            'spec/main.js': ['rollup', 'coverage']
        },

        rollupPreprocessor: {
            watch: true,
            format: 'iife',
            sourcemap: true,
            plugins: [
                strip(stripOptions),
                babel()
            ]
        },
        coverageReporter: {
            reporters: coverageReporters
        },

        reporters:  reporters,

        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: true,

        usePolling: true,

        atomic_save: false,

        browsers: ['Chrome', 'PhantomJS_custom'],

        customLaunchers: {
            PhantomJS_custom: {
                base: 'PhantomJS',
                options: {
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                debug: true
            }
        },

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-coverage',
            'karma-rollup-preprocessor',
            'karma-coveralls'
        ],

        singleRun: false,

        concurrency: Infinity
    });
};
