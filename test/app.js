/* global describe, it, before */
'use strict'
var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-generator').test

describe('Main generator', () => {
  before((done) => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({someOption: true})
      .withPrompts({someAnswer: true})
      .on('end', done)
  })

  it('creates server file', () => {
    assert.file([
      'src/server.js'
    ])
  })
  it('creates config files', () => {
    assert.file([
      'src/config/routes.js'
    ])
  })
})
