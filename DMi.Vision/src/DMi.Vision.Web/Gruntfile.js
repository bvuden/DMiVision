/// <binding BeforeBuild='build' />

var env = process.env.ENV || 'development';
var config =
  require('./Config/' + env + '.json');

//set in vs pmc:
//$env:ENV='production'

/// <binding ProjectOpened='watch' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {

    //load grunt plugins from npm
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-template');    

    //configure plugins
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir:false
                }
            }
        },
        clean: ["wwwroot/lib/*"],
        uglify: {
            my_target: {
                options: {
                    beautify: true
                },
                files: { 'wwwroot/app.js': ['Scripts/app.js', 'Scripts/**/*.js'] }
            }
        },
        watch: {
            scripts: {
                files: ['Scripts/**/*.js'],
                tasks: ['uglify']
            }
        },
        template: {
            config: {
                options: {
                    data: config
                },
            files: { 'wwwroot/config.js': ['Templates/config.js.tpl'] }
            },
            oauth2: {
                options: {
                    data:config
                },
                files: {'wwwroot/Partials/_oauth2.html':['Templates/_oauth2.html.tpl']}
            }
        }
    });

    //define tasks
    grunt.registerTask('default', ['template', 'uglify', 'watch']);
    grunt.registerTask('build', ['template', 'uglify']);
};