import { Component, createElement } from 'react'
import storeShape from '../utils/storeShape'
import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function responsive(options = {}) {
  const { withRef = false } = options

  return function wrapWithResponsive(WrappedComponent) {
    const responsiveDisplayName = `Responsive(${getDisplayName(WrappedComponent)})`

    class Responsive extends Component {

      constructor(props, context) {
        super(props, context)

        invariant(context.responsiveStore,
          `Could not find "responsiveStore" in the context or ` +
          `of "${responsiveDisplayName}". ` +
          `Wrap the root component in a <ResponsiveProvider>.`
        )

        const storeState = context.responsiveStore.getState()
        this.state = { storeState }
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

      handleChange() {
        if (!this.unsubscribe) {
          return
        }

        const storeState = this.context.responsiveStore.getState()

        this.setState({ storeState })
      }

      getWrappedInstance() {
        invariant(withRef,
          `To access the wrapped instance, you need to specify ` +
          `{ withRef: true } as the fourth argument of the responsive() call.`
        )

        return this.refs.wrappedInstance
      }

      render() {
        const mergedProps = {
          ...this.props,
          responsive: this.state.storeState
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
