module.exports = function(grunt) {

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // grunt-contrib-jshint
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    jshint: {

      // Source files
      src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],

      // Packaged files
      dist: {
        src: ['./inheritance.*'],
        options: {
          expr     : true, // W033: Missing semicolon
          lastsemic: true  // W030: Expected an assignment or function call and instead saw an expression
        }
      }
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // grunt-contrib-requirejs
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    requirejs: {
      compile: {
        options: {
          baseUrl: 'src',
          name: 'inheritance',
          //mainConfigFile: 'path/to/config.js',
          out: 'inheritance.js'
        }
      }
    }

  });

  // ---------------------------------------------------------------------------
  // Tasks
  // ---------------------------------------------------------------------------

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // lint
  grunt.registerTask('lint-src', [ // Source files
      'jshint:src'
    ]);
  grunt.registerTask('lint-dist', [ // Packaged files
      'jshint:dist'
    ]);


  // test

  // package
  grunt.registerTask('package', [
      'requirejs'
    ]);

  // default
  grunt.registerTask('default', [
      'lint-src',
      //'test',
      'package',
      'lint-dist'
    ]);

};
