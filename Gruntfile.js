module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            dev: {
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
                    "./static/bundle.js": ["./js/main.js"]
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
        'closure-compiler': {
            production: {
                js: './static/bundle.js',
                jsOutputFile: './static/bundle.min.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },
        watch: {
            less: {
                files: ['less/**/*.less'],
                tasks: ['less:dev']
            },
            express: {
                files: ['server.js'],
                tasks: ['express:dev'],
                options: {
                    atBegin: true,
                    spawn: false
                }
            }
        },
        concurrent: {
            watch: {
                tasks: ['browserify:dev', 'less', 'watch'],
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
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-closure-compiler');

    grunt.registerTask('default', ['concurrent:watch']);
};
