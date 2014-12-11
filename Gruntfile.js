module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    typescript: {
      base: {
        src: ['ts/**/*.ts'],
        dest: 'js',
        options: {
          sourceMap: true
        }
      }
    },
    concat: {
      dist: {
        src: ['js/ts/**/*.js'],
        dest: 'js/all.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'js/all.min.js': ['js/all.js']
        }
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    watch: {
      sass: {
        files: 'scss/*.scss',
        tasks: ['compass']
      },
      jslib: {
        files: ['ts/**/*.ts'],
        tasks: ['typescript', 'concat', 'uglify']
      }
    }
  });

  var taskName;
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  grunt.registerTask('build', ['typescript', 'concat', 'uglify', 'compass']);
  grunt.registerTask('default', ['watch']);
};