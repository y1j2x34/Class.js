'use strict';
module.exports = function(config){
    config.set({
        basePath: '',

        frameworks: ['browserify', 'jasmine'],

        restartBrowserBetweenTests: false,

        files: [{
            pattern: 'test/*.js',
            watched: true,
            included: true,
            served: true
        }, {
            pattern:'Class.js',
            watched: true,
            included: false,
            served: true
        }],
        preprocessors: {
            'test/*.js': ['browserify']
        },
        browserify: {
            debug: true,
            transforms: [ 'brfs' ]
        },
        /*
        preprocessors: {
            'test/*.js': ['coverage']
        },

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },*/

        reporters: ['kjhtml'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: true,

        usePolling: true,

        atomic_save: false,

        browsers: ['Chrome'],
        
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-browserify'
        ],

        singleRun: false,

        concurrency: Infinity
    });
};