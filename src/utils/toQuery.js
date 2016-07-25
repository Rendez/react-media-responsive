/**
 * Full credit to react-responsive for the mediaShape declaration:
 * https://github.com/contra/react-responsive/blob/master/src/toQuery.js
 */
import hyphenate from 'hyphenate-style-name'
import mq from './mediaQuery'

function negate(cond) {
  return 'not ' + cond
}

function keyVal(k, v) {
  // px shorthand
  if (typeof v === 'number') {
    v = `${v}px`
  }
  if (v === true) {
    return k
  }
  if (v === false) {
    return negate(k)
  }

  const realKey = hyphenate(k)
  return `(${realKey}: ${v})`
}

function join(conds) {
  return conds.join(' and ')
}

export default function(obj) {
  const rules = []

  Object.keys(mq.all).forEach(function(k) {
    var v = obj[k]
    if (v != null) {
      rules.push(keyVal(k, v))
    }
  })

  return join(rules)
}
