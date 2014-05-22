module.exports = function(grunt) {

  grunt.initConfig({
    'connect': {
      demo: {
        options: {
          open: true,
          keepalive: true
        }
      }
    },
    'jshint':{
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    'stylus':{
      dist: {
        options:{
          compress: true,
          paths:['bower_components/brick-common/styles']
        },
        files: {
          'src/x-formrow.css': 'src/x-formrow.styl'
        }
      }
    },
    'gh-pages': {
      options: {
        clone: 'bower_components/x-formrow'
      },
      src: [
        'bower_components/**/*',
        '!bower_components/x-formrow/**/*',
        'demo/*', 'src/*', 'index.html'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('build', ['jshint','stylus']);
  grunt.registerTask('deploy', ['gh-pages']);
  grunt.registerTask('server', ['connect']);
};
