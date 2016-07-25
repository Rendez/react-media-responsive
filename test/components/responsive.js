import expect from 'expect'
import React, { createClass, Children, PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import storeShape from '../../src/utils/storeShape'
import { responsive, ResponsiveProvider as Provider } from '../../src/index'

describe('React', () => {
  describe('responsive', () => {
    function createStore(state) {
      return {
        subscribe() {
          return function(){}
        },
        getState() {
          return state
        }
      }
    }

    class Passthrough extends Component {
      render() {
        return <div />
      }
    }

    class ProviderMock extends Component {
      getChildContext() {
        return { responsiveStore: this.props.store }
      }

      render() {
        return Children.only(this.props.children)
      }
    }

    ProviderMock.childContextTypes = {
      responsiveStore: storeShape.isRequired
    }

    it('should receive the store in the context', () => {
      const store = createStore({})

      @responsive()
      class Child extends Component {
        render() {
          return <div />
        }
      }

      const tree = TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <Child />
        </ProviderMock>
      )

      const child = TestUtils.findRenderedComponentWithType(tree, Child)
      expect(child.context.responsiveStore).toBe(store)
    })

    it('should pass state and props to the given component', () => {
      const media = {
        fromTablet: {
          minWidth: 768
        }
      }
      const values = {
        width: 1024
      }

      @responsive()
      class Container extends Component {
        render() {
          return <Passthrough {...this.props} />
        }
      }

      const container = TestUtils.renderIntoDocument(
        <Provider media={media} values={values}>
          <Container pass="through" responsive={{ fromTablet: false, untilTablet: true }} />
        </Provider>
      )

      const stub = TestUtils.findRenderedComponentWithType(container, Passthrough)
      expect(stub.props.pass).toEqual('through')
      expect(stub.props.responsive.fromTablet).toEqual(true)
      expect(stub.props.responsive.untilTablet).toEqual(undefined)
    })

    it('should subscribe class components to the store changes')

    it('should subscribe pure function components to the store changes')

    it('should unsubscribe before unmounting')

    it('should not attempt to set state after unmounting')

    it('should subscribe only to filtered store changes')

    it('should warn about using the store from the wrapped component')

    it('should set the displayName correctly', () => {
      expect(responsive()(
        class Foo extends Component {
          render() {
            return <div />
          }
        }
      ).displayName).toBe('Responsive(Foo)')

      expect(responsive()(
        createClass({
          displayName: 'Bar',
          render() {
            return <div />
          }
        })
      ).displayName).toBe('Responsive(Bar)')

      expect(responsive()(
        createClass({
          render() {
            return <div />
          }
        })
      ).displayName).toBe('Responsive(Component)')
    })

    it('should expose the wrapped component as WrappedComponent', () => {
      class Container extends Component {
        render() {
          return <div />
        }
      }

      const decorator = responsive()
      const decorated = decorator(Container)

      expect(decorated.WrappedComponent).toBe(Container)
    })

    it('should hoist non-react statics from wrapped component', () => {
      class Container extends Component {
        render() {
          return <div />
        }
      }

      Container.iAmResponsive = () => 'Awesome!'
      Container.foo = 'bar'

      const decorator = responsive()
      const decorated = decorator(Container)

      expect(decorated.iAmResponsive).toBeA('function')
      expect(decorated.iAmResponsive()).toBe('Awesome!')
      expect(decorated.foo).toBe('bar')
    })

    it('should throw an error if the store is not in the context', () => {
      class Container extends Component {
        render() {
          return <div />
        }
      }

      const decorator = responsive()
      const Decorated = decorator(Container)

      expect(() =>
        TestUtils.renderIntoDocument(<Decorated />)
      ).toThrow(
        /Could not find "responsiveStore"/
      )
    })

    it('should throw when trying to access the wrapped instance if withRef is not specified', () => {
      const store = createStore({})

      class Container extends Component {
        render() {
          return <div />
        }
      }

      const decorator = responsive()
      const Decorated = decorator(Container)

      const tree = TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <Decorated />
        </ProviderMock>
      )

      const decorated = TestUtils.findRenderedComponentWithType(tree, Decorated)
      expect(() => decorated.getWrappedInstance()).toThrow(
        /To access the wrapped instance, you need to specify \{ withRef: true \} as an option to the responsive\(\) call\./
      )
    })

    it('should return the instance of the wrapped component for use in calling child methods', () => {
      const store = createStore({})

      const someData = {
        some: 'data'
      }

      class Container extends Component {
        someInstanceMethod() {
          return someData
        }

        render() {
          return <div />
        }
      }

      const decorator = responsive({ withRef: true })
      const Decorated = decorator(Container)

      const tree = TestUtils.renderIntoDocument(
        <ProviderMock store={store}>
          <Decorated />
        </ProviderMock>
      )

      const decorated = TestUtils.findRenderedComponentWithType(tree, Decorated)

      expect(() => decorated.someInstanceMethod()).toThrow()
      expect(decorated.getWrappedInstance().someInstanceMethod()).toBe(someData)
      expect(decorated.refs.wrappedInstance.someInstanceMethod()).toBe(someData)
    })
  })
})
