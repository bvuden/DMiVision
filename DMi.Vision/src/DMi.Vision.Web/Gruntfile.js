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
                files: {'wwwroot/app.js': ['Scripts/app.js', 'Scripts/**/*.js']}
            }
        },
        watch: {
            scripts: {
                files: ['Scripts/**/*.js'],
                tasks: ['uglify']
            }
        }
    });

    //define tasks
    grunt.registerTask('default', ['uglify', 'watch']);
};