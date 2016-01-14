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
                    debug: true,
                    transform: [["babelify", { presets: ["react"]}]]
                }
            }
        },
        watch: {
            browserify: {
                files: ['js/**/*.js'],
                tasks: ['browserify']
            },
            less: {
                files: ['less/**/*.less'],
                tasks: ['less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
