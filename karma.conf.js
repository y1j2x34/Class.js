'use strict';
module.exports = function(config) {
    config.set({
        basePath: '',

        frameworks: ['jasmine'],

        restartBrowserBetweenTests: false,

        files: [
            './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
            {
                pattern: 'test/*.js',
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
            'test/*.js': ['webpack', 'sourcemap', 'coverage']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['env', { browsers: 'last 2 versions' }]]
                            }
                        }
                    }
                ]
            }
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

        reporters: ['kjhtml', 'coverage'],

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
            'karma-sourcemap-loader'
        ],

        singleRun: false,

        concurrency: Infinity
    });
};
