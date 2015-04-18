module.exports = function (grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    files: {},

    sass: {
      dev: {
        options: {
          sourceMap: true,
          sourceComments: 'map'
        },
        includePaths: ['app/style'],
        files: {
          'app/style/master.css': ['app/style/*.scss']
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      main: {
        src: ['app/**/*.js']
      }
    },


    /*==== BEGIN Server config ====*/
    express: {
      dev: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          bases: ['./']
//                    livereload: true
        }
      }
    },
    watch: {
      options: {
//                livereload: true
      },
      sass: {
        files: ['./app/style/**/*.scss'],
        tasks: ['sass:dev']
      },
      html: {
        files: ['./app/index.html']
      }
    },
    open: {
      all: {
        path: 'http://localhost:<%= express.dev.options.port %>'
      }
    },
    // ==== END Server config

    wiredep: {
      app: {
        src: ['./index.html'],
        ignorePath: /\.\.\//
      },
      sass: {
        src: ['./app/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    }

  });


  // ==== GRUNT registering tasks
  grunt.registerTask('serve', [
    'wiredep',
    'sass:dev',
    'express:dev',
    'open',
    'watch:sass'
  ]);
};
