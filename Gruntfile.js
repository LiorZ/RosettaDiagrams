module.exports = function(grunt) {
	
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  mocha_phantomjs: {
    all: {
      options: {
        urls: [
          "http://localhost:8000/tests/backbone/index.html",
        ]
      }
    }
  },
  connect: {
      server: {
        options: {
          port: 8000,
          base: 'public/.',
        }
      }
    }
});

grunt.loadNpmTasks('grunt-mocha-phantomjs');
grunt.loadNpmTasks('grunt-contrib-connect');

grunt.registerTask('test', ['connect', 'mocha_phantomjs']);
};