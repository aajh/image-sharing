module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: ["less"]
                },
                files: {
                    "static/css/style.css": "less/main.less"
                }
            }
        },
        browserify: {
            dev: {
                files: {
                    "./static/js/bundle.js": ["./js/main.js"]
                },
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        debug: true,
                        transform: [["babelify", { presets: ["react"]}]]
                    }
                }
            }
        },
        watch: {
            less: {
                files: ['less/**/*.less'],
                tasks: ['less:development']
            }
        },
        concurrent: {
            watch: {
                tasks: ['browserify:dev', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent:watch']);
};
