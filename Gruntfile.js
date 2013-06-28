module.exports = function(grunt) {

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Clean
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    clean: {
      package: [
          './inheritance.*.js',
          './inheritance.*.map'
        ]
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Lint
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // grunt-contrib-jshint
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

    // grunt-html
    // htmllint: {
    //   src: ['src/**/*.html', 'tests/**/*.html']
    // },

    // grunt-contrib-csslint
    csslint: {

      // Source files
      src: ['src/**/*.css', 'test/**/*.css'],

      // Packaged files
      dist: {
        src: ['./*.css'],
        options: {
        }
      }

    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Test & Server
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // grunt-contrib-connect
    connect: {
      all: {
        options: {
          hostname: '*'
        }
      },
      test: {
      },
      server: {
        options: {
          hostname: '*',
          keepalive: true
        }
      }
    },

    // grunt-contrib-qunit
    qunit: {
      src: {
        options: {
          urls: [
            'http://localhost:8000/test/inheritance-src.html'
          ]
        }
      },
      dist: {
        options: {
          urls: [
            'http://localhost:8000/test/inheritance-dist-uncompressed.html',
            'http://localhost:8000/test/inheritance-dist-uglify.html',
            'http://localhost:8000/test/inheritance-dist-uglify2.html'
          ]
        }
      }
    },

    // grunt-qunit-junit
    qunit_junit: {
      options: {
        dest: 'dist/test'
      }
    },

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // grunt-contrib-requirejs
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    requirejs: {
      options: {
        baseUrl: 'src',
        name: 'inheritance',
        generateSourceMaps: true
        //mainConfigFile: 'path/to/config.js',
      },
      uncompressed: {
        options: {
          optimize: 'none',
          out: 'inheritance.uncompressed.js'
        }
      },
      uglify: {
        options: {
          optimize: 'uglify',
          out: 'inheritance.uglify.js',
          generateSourceMaps: false // "uglify" does not support generateSourceMaps
        }
      },
      uglify2: {
        options: {
          optimize: 'uglify2',
          out: 'inheritance.uglify2.js',
          preserveLicenseComments: false // Cannot use preserveLicenseComments and generateSourceMaps together
        }
      },
      closure: {
        options: {
          optimize: 'closure',
          out: 'inheritance.closure.js',
          preserveLicenseComments: false // Cannot use preserveLicenseComments and generateSourceMaps together
        }
      }
    }

  });

  // ---------------------------------------------------------------------------
  // Tasks
  // ---------------------------------------------------------------------------


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Clean
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('clean-all', [
      'clean:package'
    ]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Lint
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-contrib-csslint');

  grunt.registerTask('lint-src', [ // Source files
      'jshint:src',
      // 'htmllint:src'
      'csslint:src'
    ]);
  grunt.registerTask('lint-dist', [ // Packaged files
      'jshint:dist',
      'csslint:dist'
    ]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Test
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-junit');

  grunt.registerTask('test-src', [
      'connect:test',
      //'qunit_junit',
      'qunit:src'
    ]);

  grunt.registerTask('test-dist', [
      //'connect:test',
      //'qunit_junit',
      'qunit:dist'
    ]);

  grunt.registerTask('test', [
      'test-src'
    ]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Server
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  grunt.registerTask('server', [
      'connect:server'
    ]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Package
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('package', [
      'requirejs:uncompressed',
      'requirejs:uglify',
      'requirejs:uglify2'//,
      //'requirejs:closure    // Only available if running the optimizer using Java.
    ]);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Default
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  grunt.registerTask('default', [
      'clean-all',
      'lint-src',
      'test-src',
      'package',
      'lint-dist',
      'test-dist'
    ]);

};
