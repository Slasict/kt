module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      concat: {
          libs: {
              src: [
                //'vendor/jquery-1.10.2.js',
                'vendor/angular.js',
                'vendor/angular-route.js',
                'vendor/angular-sanitize.js',
                'vendor/angular-dialogs.js',
                'vendor/ui-bootstrap-tpls-0.11.2.js',
                'vendor/**.js'
              ],
              dest: 'src/vendors.concat.js'
          },
          app: {
              src: [
                'src/app/controllers/InitControllers.js',
                'src/app/controllers/**.js',

                'src/app/directives/InitDirectives.js',
                'src/app/directives/**.js',

                'src/app/factories/InitFactories.js',
                'src/app/factories/**.js',
                
                'src/app/modules/**.js',

                'src/app.js'
              ],
              dest: 'src/app.concat.js'
          }
      },

      watch: {
          concat: {
              files: ['src/**/*.js', '!src/app.js', '!src/vendors.js'],
              tasks: ['concat']
          }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat']);
};
