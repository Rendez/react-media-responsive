'use strict'

var webpack = require('webpack')

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

var config = {
  externals: {
    'react': reactExternal
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ReactMediaResponsive',
    libraryTarget: 'umd'
  },
  plugins: [
    {
      apply: function apply(compiler) {
        compiler.parser.plugin('expression global', function expressionGlobalPlugin() {
          this.state.module.addVariable('global', "(function() { return this; }()) || Function('return this')()")
          return false
        })
      }
    },
    new webpack.optimize.OccurenceOrderPlugin()
  ]
}

module.exports = config
