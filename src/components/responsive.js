import { Component, createElement } from 'react' // eslint-disable-line no-unused-vars
import storeShape from '../utils/storeShape'
import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function responsive(options = {}) {
  const { withRef = false, only = [] } = options

  return function wrapWithResponsive(WrappedComponent) {
    const responsiveDisplayName = `Responsive(${getDisplayName(WrappedComponent)})`

    class Responsive extends Component {

      constructor(props, context) {
        super(props, context)

        invariant(context.responsiveStore,
          `Could not find "responsiveStore" in the context ` +
          `of "${responsiveDisplayName}". ` +
          `Wrap the root component in a <ResponsiveProvider>.`
        )

        invariant(Array.isArray(only),
          'The option "only" needs to be an array containing strings with the values passed to the responsiveStore.'
        )

        this.state = context.responsiveStore.getState()
      }

      componentWillMount() {
        if (!this.unsubscribe) {
          this.unsubscribe = this.context.responsiveStore.subscribe(this.handleChange.bind(this))
        }
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.unsubscribe = null
        }
      }

      shouldComponentUpdate(props, state) {
        if (!only.length) {
          return true
        }

        return only.some(function (value) {
          invariant(typeof state[value] === 'boolean',
            `Value string passed to option "only" does not match ` +
            `any name passed to the responsiveStore via the Provider.`
          )

          return state[value] !== value
        })
      }

      handleChange() {
        if (!this.unsubscribe) {
          return
        }
        // TODO set state filtered by the `only` array.
        // optimize here instead of shouldComponentUpdate?
        this.setState(this.context.responsiveStore.getState())
      }

      getWrappedInstance() {
        invariant(withRef,
          `To access the wrapped instance, you need to specify ` +
          `{ withRef: true } as an option to the responsive() call.`
        )

        return this.refs.wrappedInstance
      }

      render() {
        const mergedProps = {
          ...this.props,
          responsive: this.state
        }

        if (withRef) {
          return createElement(WrappedComponent, {
            ...mergedProps,
            ref: 'wrappedInstance'
          })
        } else {
          return createElement(WrappedComponent, {
            ...mergedProps
          })
        }
      }
    }

    Responsive.displayName = responsiveDisplayName
    Responsive.WrappedComponent = WrappedComponent
    Responsive.contextTypes = {
      responsiveStore: storeShape
    }

    return hoistStatics(Responsive, WrappedComponent)
  }
}
