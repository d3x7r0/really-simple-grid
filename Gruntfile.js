/*global module:false*/
module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json'),
        bower = grunt.file.readJSON('bower.json');

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        project: {
            pkg: pkg,
            bower: bower,
            banner: '/*! <%= project.pkg.title || project.pkg.name %> - v<%= project.pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= project.pkg.homepage ? "* " + project.pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= project.pkg.author %>;' +
            ' Licensed <%= project.pkg.license %> */\n'
        },
        // Task configuration.
        clean: ['dist'],
        less: {
            dist: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({
                            browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera >= 12.1", "ie >= 8"]
                        })
                    ],
                    banner: '<%= project.banner %>'
                },
                files: [{
                    cwd: 'less/',
                    expand: true,
                    src: [
                        '**.less'
                    ],
                    dest: 'dist/',
                    ext: ".css"
                }]
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: '<%= project.banner %>'
                },
                files: [{
                    cwd: 'dist/',
                    expand: true,
                    src: [
                        '**.css',
                        '!**.min.css'
                    ],
                    dest: 'dist/',
                    ext: '.min.css'
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['project.pkg', 'project.bower'],
                commitFiles: ['package.json', 'bower.json', 'css/*'],
                pushTo: 'origin',
                push: grunt.option('push') === true
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Build task
    grunt.registerTask('build', ['less', 'cssmin']);
    grunt.registerTask('release', function (type) {
        type = type || 'patch';

        grunt.task.run(['bump-only:' + type, 'build', 'bump-commit']);
    });

    // Default task.
    grunt.registerTask('default', ['build']);
};
