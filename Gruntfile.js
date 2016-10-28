/*
 * grunt-scriptlinker
 * https://github.com/scott-laursen/grunt-scriptlinker
 *
 * Copyright (c) 2013 scott-laursen
 * Copyright (c) 2013 Zoli Kahan
 * Copyright (c) 2014 Mike McNeil
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var util = require('util');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    'sails-linker': {
      default_options: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s" type="%s"></script>',
          appRoot: 'test/'
        },
        files: {
          'test/fixtures/**/file.html': 'test/fixtures/*.js'
        }
      },
      moduleObject_options: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileTmpl: '<script src="%s" type="%s"></script>',
          appRoot: 'test/'
        },
        files: {
          'test/fixtures/**/fileModuleObject.html' : require('./test/fixtures/complexTest').jsFilesToInject
        }
      },
      fileRef_options: {
        options: {
          startTag: '<!--SCRIPTS-->',
          endTag: '<!--SCRIPTS END-->',
          fileRef: function (filepath) {
            var tmpl = '<script src="%s"></script>';
            return util.format(tmpl, filepath);
          },
          appRoot: 'test/'
        },
        files: {
         'test/fixtures/**/file.html': 'test/fixtures/*.js'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'sails-linker:default_options', 'sails-linker:moduleObject_options', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
