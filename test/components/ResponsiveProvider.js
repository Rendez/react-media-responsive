import expect from 'expect'
import React, { PropTypes, Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import { ResponsiveProvider as Provider } from '../../src/index'

describe('React', () => {
  describe('ResponsiveProvider', () => {
    class Child extends Component {
      render() {
        return <div />
      }
    }

    Child.contextTypes = {
      responsiveStore: PropTypes.object.isRequired
    }

    it('should enforce a single child', () => {
      const media = {}

      // Ignore propTypes warnings
      const propTypes = Provider.propTypes
      Provider.propTypes = {}

      try {
        expect(() => TestUtils.renderIntoDocument(
          <Provider media={media}>
            <div />
          </Provider>
        )).toNotThrow()

        expect(() => TestUtils.renderIntoDocument(
          <Provider media={media}>
          </Provider>
        )).toThrow(/exactly one child/)

        expect(() => TestUtils.renderIntoDocument(
          <Provider media={media}>
            <div />
            <div />
          </Provider>
        )).toThrow(/exactly one child/)
      } finally {
        Provider.propTypes = propTypes
      }
    })

    it('should create a store and place it in the child context', () => {
      const media = {}

      const spy = expect.spyOn(console, 'error')
      const tree = TestUtils.renderIntoDocument(
        <Provider media={media}>
          <Child />
        </Provider>
      )
      spy.destroy()
      expect(spy.calls.length).toBe(0)

      const child = TestUtils.findRenderedComponentWithType(tree, Child)
      expect(child.context.responsiveStore).toIncludeKeys(['subscribe', 'getState'])
    })
  })
})
