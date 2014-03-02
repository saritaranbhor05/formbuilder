ALL_TASKS = ['jst:all', 'coffee:all', 'concat:all', 'stylus:all', 'shell:multiple']

module.exports = (grunt) ->

  path = require('path')
  exec = require('child_process').exec

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-jst')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-shell')

  grunt.initConfig

    pkg: '<json:package.json>'

    jst:
      all:
        options:
          namespace: 'Formbuilder.templates'
          processName: (filename) ->
            filename.replace('./templates/', '').replace('.html', '')

        files:
          'templates/compiled.js': ['./templates/**/*.html']

    coffee:
      all:
        files:
          'js/compiled.js': ['coffee/rivets-config.coffee', 'coffee/main.coffee', 'coffee/fields/*.coffee']

    concat:
      all:
        src: ['js/compiled.js', 'templates/compiled.js']
        dest: 'formbuilder.js'

    cssmin:
      dist:
        files:
          'formbuilder-min.css': ['formbuilder.css']

    stylus:
      all:
        options:
          compress: false
        files:
          'formbuilder.css': 'styl/formbuilder.styl'

    uglify:
      dist:
        files:
          'formbuilder-min.js': 'formbuilder.js'

    watch:
      all:
        files: ['./coffee/**/*.coffee', 'templates/**/*.html', './styl/**/*.styl']
        tasks: ALL_TASKS

    shell:
      multiple:
        command: ['cp formbuilder.js /home/tanmay/Documents/bri/bri-rails/public/js/lib/',
                  'cp formbuilder.js /home/tanmay/Documents/bri/bri-rails/lib/form_submissions_template/src/javascripts/'].join('&&')
        options:
          stdout: true
          stderr: true

  grunt.registerTask 'default', ALL_TASKS
  grunt.registerTask 'dist', ['cssmin:dist', 'uglify:dist']
