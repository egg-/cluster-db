module.exports = (grunt) ->
  # load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  # load package config
  pkg = grunt.file.readJSON('package.json')

  grunt.initConfig

    # jsdoc2md
    jsdoc2md:
      api:
        src: 'lib/*.js'
        dest: 'Documentation.md'


  # register task
  grunt.registerTask 'default', () ->
    grunt.task.run [
      'jsdoc2md'
    ]
