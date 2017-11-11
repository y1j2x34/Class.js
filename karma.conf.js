'use strict';
module.exports = function(config) {
    var babelOptions = {
        presets: [
            [
                'env',
                {
                    browsers: 'last 2 versions'
                }
            ]
        ]
    };
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
                pattern: 'test/main.js',
                watched: true,
                included: true,
                served: true
            },
            {
                pattern: 'Class.js',
                watched: true,
                included: false,
                served: true
            }
        ],
        preprocessors: {
            'test/main.js': ['webpack', 'sourcemap', 'coverage']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: babelOptions
                        }
                    }
                ]
            }
        },
        coverageReporter: {
            reporters: coverageReporters,
            // instrumenters: { isparta : require('isparta') },
            // instrumenter: {
            //     '**/*.js': 'isparta'
            // }
        },

        reporters: reporters,

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
            'karma-webpack',
            'karma-coverage',
            'karma-babel-preprocessor',
            'karma-sourcemap-loader',
            'karma-coveralls'
        ],

        singleRun: false,

        concurrency: Infinity
    });
};
