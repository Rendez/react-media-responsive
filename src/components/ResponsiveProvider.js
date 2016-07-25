import { Component, PropTypes, Children } from 'react'
import matchMedia from 'matchmedia'
import hyphenate from 'hyphenate-style-name'
import mediaQuery from '../utils/mediaQuery'
import storeShape from '../utils/storeShape'
import toQuery from '../utils/toQuery'
import canUseDOM from 'can-use-dom'

/**
 * Creates a Responsive store that holds the state tree.
 * There is no way to change the data in the store externally; instead media
 * matches do internally.
 *
 * There should only be a single store in your app.
 *
 * @param {Object} [queries] An object that is used to subscribe to matching
 * queries, and that will in turn modify the current state of responsiveness.
 *
 * @param {Object} [values] The initial values. You may optionally specify it
 * to hydrate the state from the server in universal apps.
 *
 * @returns {Store} A Responsive store that lets you read the state, set media
 * queries and subscribe to changes.
 */
function createStore(queries, values) {
  const listeners = []
  let currentState = {}
  let timeoutID = 0

  if (values) {
    values = Object.keys(values).reduce(function(result, key) {
      result[hyphenate(key)] = values[key]
      return result
    }, {});
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState
  }

  /**
   * Adds a change listener. It will be called any time a media query matches,
   * and some part of the state has changed. You may then call `getState()`
   * to read the current state inside the callback.
   *
   * @param {Function} listener A callback to be invoked on every media match.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    let isSubscribed = true

    listeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  /**
   * Registers a media query object using addListener(). Everytime a match
   * is trigered, the current state changes to reflect it with a boolean
   * value. Then every registered callback in `listeners` is executed.
   *
   * @param {Object} obj key-value pairs with media queries to match
   * @param {String} name of media match that will be flagged with a boolean
   * @returns {void}
   */
  function media(obj, name) {
    const mql = matchMedia(toQuery(obj), values)
    const handlerFn = handler(name, mql);
    mql.addListener(handlerFn)
    handlerFn()
  }

  /**
   * Callback used for responsive assignments. Listeners should not expect to
   * see all state changes, as the state might have been updated multiple times
   * as a result of several consecutive media query matches.
   *
   * @param {String} name of media match that will be flagged with a boolean
   * @param {Boolean} value representing the state of the matched media query
   * @returns {Function} returns a wrapper function triggering callbacks
   */
  function handler(name, mql) {
    return function () {
      if (mql.matches === currentState[name]) {
        return
      }

      const newState = {}
      newState[name] = mql.matches

      currentState = { ...currentState, ...newState }

      clearTimeout(timeoutID)
      timeoutID = setTimeout(function () {
        for (let i = 0; i < listeners.length; i++) {
          listeners[i]()
        }
      }, 60)
    }
  }

  if (canUseDOM) {
    for (let name in queries) {
      if (queries.hasOwnProperty(name)) {
        media(queries[name], name)
      }
    }
  }

  return {
    subscribe,
    getState
  }
}

export default class ResponsiveProvider extends Component {
  getChildContext() {
    return { responsiveStore: this.responsiveStore }
  }

  constructor(props, context) {
    super(props, context)
    this.responsiveStore = createStore(props.media, props.values)
  }

  render() {
    return Children.only(this.props.children)
  }
}

function getPropTypeMatchers() {
  const matchers = { ...mediaQuery.matchers }
  delete matchers.type
  return PropTypes.shape(matchers)
}

ResponsiveProvider.propTypes = {
  media: PropTypes.shape(mediaQuery.all).isRequired,
  values: getPropTypeMatchers(),
  children: PropTypes.element.isRequired
}

ResponsiveProvider.childContextTypes = {
  responsiveStore: storeShape.isRequired
}
