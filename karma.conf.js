'use strict';
module.exports = function(config) {
    var path = require('path');
    var babel = require('rollup-plugin-babel');
    var istanbule = require('rollup-plugin-istanbul');

    var reporters = ['kjhtml', 'coverage-istanbul'];
    var coverageReporters = [
        {
            type: 'text-summary'
        }
    ];
    if (process.env.TRAVIS) {
        console.log('On Travis sending coveralls');
        coverageReporters.push({
            type: 'lcov',
            dir: 'coverage'
        });
        reporters.push('coveralls');
    } else {
        console.log('Not on Travis so not sending coveralls');
        coverageReporters.push({
            type: 'html',
            dir: 'coverage'
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
                pattern: 'spec/*.js',
                watched: true,
                included: false,
                served: false
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
            'spec/main.js': ['rollup']
        },

        rollupPreprocessor: {
            watch: {
                include: ['spec/**/*.js', 'src/**/*.js']
            },
            format: 'iife',
            sourcemap: 'inline',
            plugins: [
                // strip(stripOptions),
                istanbule({
                    exclude: 'spec/**/*.js'
                }),
                babel()
            ]
        },

        reporters:  reporters,

        coverageIstanbulReporter: {
            reports: ['html', 'text-summary'],

            dir: path.join(__dirname, 'coverage'),

            fixWebpackSourcePaths: true,

            skipFilesWithNoCoverage: true,
            'report-config': {
                html: {
                    subdir: 'html'
                }
            }
        },

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
            'karma-rollup-preprocessor',
            'karma-coveralls',
            'karma-coverage-istanbul-reporter'
        ],

        singleRun: false,

        concurrency: Infinity
    });
};
