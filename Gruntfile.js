// Generated on 2016-11-03 using generator-mad-angular 1.0.0
'use strict';

const serveStatic = require('serve-static');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  const packageJson = require('./package.json');

  // Configurable paths for the application
  const appConfig = {
    app: packageJson.appPath || 'app',
    version: packageJson.version || 'unknown',
    name: packageJson.name || 'unknown',
    dist: 'dist', // used by yeoman project settings
    testPort: grunt.option('testPort') || 9001
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        protocol: 'http'
      },
      test: {
        options: {
          port: appConfig.testPort,
          middleware: function () {
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              serveStatic(appConfig.app)
            ];
          }
        }
      }
    },

   // Make sure code styles are up to par and there are no obvious mistakes
    eslint: {
      all: {
        options: {
          configFile: '.eslintrc'
        },
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/es6/**/*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/scripts',
          src: ['*.js', '!*.spec.js', '!*.map'],
          dest: '.tmp/scripts'
        }]
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['.tmp/scripts/index.js', '.tmp/scripts/*.js', '!.tmp/scripts/*.spec.js', '!.tmp/scripts/*.map'],
        dest: 'dist/jarb-angular-formly.js'
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/jarb-angular-formly.min.js': 'dist/jarb-angular-formly.js'
        }
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          { src: ['README.md', 'LICENSE.md'], dest: 'dist/' }
        ]
      }
    },

    // Unit test settings
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      single: { // Run once with coverage
        singleRun: true,
        coverage: true
      },
      debug: { // Run continuously without coverage so you can set breakpoints.
        singleRun: false,
        coverage: false
      },
      dev: { // Run continuously and report coverage.
        singleRun: false,
        coverage: true,
        port: 9003
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json'],
        commit: false,
        createTag: false,
        push: false
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      server: {
        expand: true,
        cwd: '<%= yeoman.app %>/es6',
        src: '**/*.js',
        dest: '.tmp/scripts/'
      },
      e2e: {
        expand: true,
        dot: true,
        cwd: 'test',
        dest: '.tmp/test',
        src: [
          '**/*.e2e.js'
        ]
      }
    }
  });

  grunt.registerTask('test', function () {
    const tasks = [
      'clean:server',
      'babel:server',
      'eslint',
      'connect:test'
    ];
    tasks.push('karma:single');
    grunt.task.run(tasks);
  });

  grunt.registerTask('build', function() {
    grunt.task.run([
      'test', // Test App before building.
      'clean:server',
      'clean:dist',
      'babel:server',
      'ngAnnotate',
      'concat:dist',
      'uglify:dist',
      'copy:dist'
    ]);
  });
};
