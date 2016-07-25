/**
 * Full credit to react-responsive for the mediaShape declaration:
 * https://github.com/contra/react-responsive/blob/master/src/mediaQuery.js
 */
import { PropTypes } from 'react'

const { number, string, bool, oneOf, oneOfType } = PropTypes
const stringOrNumber = oneOfType([ string, number ])

// properties that match media queries
const matchers = {
  orientation: oneOf([
    'portrait',
    'landscape'
  ]),

  scan: oneOf([
    'progressive',
    'interlace'
  ]),

  aspectRatio: string,
  deviceAspectRatio: string,

  height: stringOrNumber,
  deviceHeight: stringOrNumber,

  width: stringOrNumber,
  deviceWidth: stringOrNumber,

  color: bool,

  colorIndex: bool,

  monochrome: bool,
  resolution: stringOrNumber
}

// media features
const features = {
  minAspectRatio: string,
  maxAspectRatio: string,
  minDeviceAspectRatio: string,
  maxDeviceAspectRatio: string,

  minHeight: stringOrNumber,
  maxHeight: stringOrNumber,
  minDeviceHeight: stringOrNumber,
  maxDeviceHeight: stringOrNumber,

  minWidth: stringOrNumber,
  maxWidth: stringOrNumber,
  minDeviceWidth: stringOrNumber,
  maxDeviceWidth: stringOrNumber,

  minColor: number,
  maxColor: number,

  minColorIndex: number,
  maxColorIndex: number,

  minMonochrome: number,
  maxMonochrome: number,

  minResolution: stringOrNumber,
  maxResolution: stringOrNumber
}

Object.assign(features, matchers)

// media types
const types = {
  all: bool,
  grid: bool,
  aural: bool,
  braille: bool,
  handheld: bool,
  print: bool,
  projection: bool,
  screen: bool,
  tty: bool,
  tv: bool,
  embossed: bool
}

const all = {}
Object.assign(all, types)
Object.assign(all, features)

// add the type property
Object.assign(matchers, { type: Object.keys(types) })

module.exports = {
  all: all,
  types: types,
  matchers: matchers,
  features: features
}
