'use strict';

module.exports = function(config) {

  // The JavaScript preprocessors for the /app folder.
  var babelPlugins = [];

  if (config.coverage === true) {
    babelPlugins.push(['istanbul', {
      exclude: [
        '**/*.spec.js',
        '**/*.e2e.js',
        'test/**/*.js'
        ]
      }
    ]);
  }

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'jarb-angular-formly/node_modules/angular/angular.js',
      'jarb-angular-formly/node_modules/angular-mocks/angular-mocks.js',
      'jarb-angular-formly/node_modules/lodash/lodash.js',
      'jarb-angular-formly/app/es6/index.js',
      'jarb-angular-formly/app/es6/**/*.js'
    ],

    // web server port
    port: 9002,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-junit-reporter',
      'karma-babel-preprocessor',
      'karma-sourcemap-loader',
      'karma-spec-reporter'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // coverage reporter generates the coverage
    reporters: ['spec', 'coverage', 'junit'],

    preprocessors: {
      'jarb-angular-formly/app/**/*.js': ['babel', 'sourcemap'],
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: "inline",
         plugins: babelPlugins
      }
    },

    // optionally, configure the reporter
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: 'report'
    },

    // The configure the reporter that is ran in the terminal.
    specReporter: {
      suppressErrorSummary: false, // Print error at the end of a test run
      suppressSkipped: true, // Ignore information about skipped tests.
      showSpecTiming: true // print the time elapsed for each spec
    },

    // Write the results of the test in a JUnit format so Sonar can analyze it.
    junitReporter: {
      useBrowserName: false,
      outputFile: 'coverage/unit-test-results.xml'
    }
  });
};
