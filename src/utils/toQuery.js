import hyphenate from 'hyphenate-style-name'

const re = /[height|width]$/

function isDimension(feature) {
  return re.test(feature)
}
function negate(cond) {
  return `not ${cond}`
}

export default function toQuery(obj) {
  let mq = ''
  const features = Object.keys(obj)

  features.forEach(function (feature, index) {
    let value = obj[feature]
    feature = hyphenate(feature)
    // Add px to dimension features
    if (isDimension(feature) && typeof value === 'number') {
      value = `${value}px`
    }
    if (value === true) {
      mq += feature
    } else if (value === false) {
      mq += negate(feature)
    } else {
      mq += `(${feature}: ${value})`
    }
    if (index < features.length-1) {
      mq += ' and '
    }
  })

  return mq
}
