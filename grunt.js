/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    concat: {
      coffee: {
        src: ['javascripts/coffee/*.js'],
        dest: 'javascripts/app.js'
      },
      lib: {
        src: ['javascripts/lib/*.js'],
        dest: 'javascripts/lib.min.js'
      }
    },
    min: {
      dist: {
        src: ['javascripts/app.js'],
        dest: 'javascripts/app.min.js'
      }
    }
  });
  
  // Default task.
  grunt.registerTask('default', 'concat min');
};
