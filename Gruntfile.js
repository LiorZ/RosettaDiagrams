module.exports = function (grunt) {
    grunt.initConfig({
        wiredep: {
          directory:'/bower_components',
          target: {
            src:['app.html']
          }
        }
    });
    grunt.loadNpmTasks('grunt-wiredep');
};
