'use strict';
module.exports = function(config) {
    var path = require('path');
    var babel = require('rollup-plugin-babel');
    var istanbule = require('rollup-plugin-istanbul');

    var rollupPlugins =  [
        babel()
    ];

    var reporters = ['kjhtml'];

    var coverageIstanbulReporter = {
        reports: ['html', 'text-summary'],

        dir: path.join(__dirname, 'coverage'),

        fixWebpackSourcePaths: true,

        skipFilesWithNoCoverage: true,
        'report-config': {
            html: {
                subdir: 'html'
            }
        }
    };

    var coverageReporters = [{
        type: 'text-summary'
    }, {
        type: 'lcov',
        dir: 'coverage'
    }];

    if (process.env.TRAVIS) {
        console.log('On Travis sending coveralls');
        reporters.push('coverage','coveralls');
    } else {
        console.log('Not on Travis so not sending coveralls');
        rollupPlugins.unshift(istanbule({
            exclude: 'spec/**/*.js'
        }));
        reporters.push('coverage-istanbul');
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
            'spec/main.js': ['rollup']
        },

        rollupPreprocessor: {
            watch: true,
            format: 'iife',
            sourcemap: true,
            plugins:rollupPlugins
        },

        reporters:  reporters,

        coverageIstanbulReporter: coverageIstanbulReporter,

        coverageReporter: {
            reporters: coverageReporters
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
            'karma-coverage',
            'karma-coverage-istanbul-reporter'
        ],

        singleRun: false,

        concurrency: Infinity
    });
};
