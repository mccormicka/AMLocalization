module.exports = function (grunt) {
    'use strict';

    // copies dev files, build compass and watches for changes.
    grunt.registerTask('default',
        [ 'karma:setup', 'build', 'watch']);

    grunt.registerTask('build',
        ['clean', 'shell:generateTests', 'jshint', 'requirejs:dev', 'requirejs:dist', /**'compass:dev',**/ 'karma:setup:run']);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            options: { force: true },
            all: ['dist/<%= pkg.name %>.js' , 'dist/<%= pkg.name %>.min.js']
        },

        //Tests Client
        karma: {
            //Enables autowatching of files when running everything.
            setup: {
                configFile: 'tests/karma.conf.js',
                autoWatch: false,
                background: true
            },
            //Development testing does not stop Karma runner.
            dev: {
                configFile: 'tests/karma.conf.js',
                autoWatch: true,
                background: false
            },
            //continuous integration mode: run tests once in PhantomJS browser.
            //Don't use this one look into teamcity runner.
            dist: {
                configFile: 'tests/karma.conf.js',
                singleRun: true,
                autoWatch: false
//                ,
//                browsers: ['PhantomJS']
            }
        },

        //Creates tests file for jasmine html runner
        shell: {
            generateTests: {
                command: './tests/jasmine/generate-tests.sh'
            }
        },

        //Cleanup code.
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: {src: [
                'scripts/**/*.js'
            ]}
        },

        watch: {
            files: ['scripts/**/*'],
            tasks: ['build']
        },

        //Compile stylesheets
        compass: {
            options: {
                cssDir: 'dist/styles',
                sassDir: 'styles',
                imagesDir: 'sprites',
                generatedImagesDir: 'dist/images/sprites',
                httpGeneratedImagesPath: '/images/sprites'
            },
            dev: {
                options: {
                    outputStyle: 'expanded'
                }
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                }
            }
        },

        //Compile all the client side scripts into one for requirejs.
        requirejs: {
            dev: {
                options: {
                    paths: {
                        '<%= pkg.name %>': 'scripts/index'
                    },
                    name: '<%= pkg.name %>',
                    baseUrl: './',
                    mainConfigFile: 'require.config.js',
                    out: 'dist/<%= pkg.name %>' + '.js',
                    optimize: 'none',
                    exclude: [
                        'angular'
                    ]
//                    useSourceUrl: true
                }
            },
            dist: {
                options: {
                    paths: {
                        '<%= pkg.name %>': 'scripts/index'
                    },
                    name: '<%= pkg.name %>',
                    baseUrl: './',
                    mainConfigFile: 'require.config.js',
                    out: 'dist/<%= pkg.name %>' + '.min.js',
                    exclude: [
                        'angular'
                    ]
                }
            }
        }
    });

    // Load the plugins
    // Watch the file system for changes.
    grunt.loadNpmTasks('grunt-contrib-watch');
    // Runs client side tests.
    grunt.loadNpmTasks('grunt-karma');
    // Clean code validator.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //Code optimization
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    //clean output directory
    grunt.loadNpmTasks('grunt-contrib-clean');
    //Runs shell scripts
    grunt.loadNpmTasks('grunt-shell');
    //CSS compass compiler
    grunt.loadNpmTasks('grunt-contrib-compass');

};