'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var path = require('path')
var _ = require('lodash')
var yosay = require('yosay')

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', { type: String, required: false })
    this.projectName = this.name || path.basename(process.cwd()) || 'kyper-node-starter'
    this.version = "0.0.1"
  },
  prompting: function () {
    var done = this.async()

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the luminous ' + chalk.red('generator-kyper-node') + ' generator!'
    ))

    var prompts = [
      {
        type: 'confirm',
        name: 'mongo',
        message: 'Would you like to include mongo?',
        default: true
      }
    ]

    this.prompt(prompts, function (props) {
      this.answers = props
      // To access props later use this.answers.someOption

      done()
    }.bind(this))
  },

  writing: {
    app: function () {
      var appFilesArray = [
        {src:'src/**', dest: 'src'},
      ]
      this.copyFiles(appFilesArray)
      //Add mongo specific files
      // if(this.answers.includeMongo){
      //   this.copyFiles([
      //     {src: '_matter-helper.js', dest: 'app/helpers/matter.js'},
      //   ])
      // }
    },
    projectfiles: function () {
      var projectFilesArray = [
        {src:'_package.json', dest: 'package.json'},
        {src:'gitignore', dest: '.gitignore'},
        {src:'babelrc', dest: '.babelrc'},
        {src:'LICENSE', dest: 'LICENSE'}

      ]
      this.copyFiles(projectFilesArray)
    }
  },

  install: function () {
    this.npmInstall()
  },
  /**
   * @param {Array|Object} filesArray
   */
  copyFiles: function(filesArray){
    var array = []
    if(_.isArray(filesArray)){
      array = filesArray
    } else { //Handle array of arguments if first argument is not array
      array = arguments
    }
    for(var i=0 i < array.length i++){
      var src = ''
      var destination = ''
      if (!_.has(array[i],'src')) {
        if (_.isString(array[i])) {
          src = array[i]
        } else {
          console.error('Invalid source for file copying.')
          throw new Error('Invalid source for file copy.')
        }
      }
      if(_.isObject(array[i])){
        src = array[i].src
        destination = array[i].dest || array[i].src //Make destination source if not provided
      }
      if(src.charAt(0) === "_"){ //template if filename starts with _
        //Copy with templating
        this.template(src, destination, this.templateContext)
      } else if(src.indexOf('*') !== -1 || src.indexOf('/**') !== -1) {
        //TODO: make this work better (work with nested folders and use src correctly)
        src.replace("**", "") //Remove /**
        src.replace("/", "") //Remove /
        this.directory(destination, destination)
      } else {
        //Normal copy
        this.fs.copy(
          this.templatePath(src),
          this.destinationPath(destination)
        )
      }
    }
  }
})
