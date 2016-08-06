# react-media-responsive


## Usable, but still under development

There will be examples both vanilla React and also together with Redux, but I'd like to write more test cases and add some more coverage. In the meantime feel free to use this at your own risk. At this point, feedback is very welcomed, as well as contributions. For that, please use Github [issues](https://github.com/Rendez/react-media-responsive/Issues) and follow the [Code of Conduct](https://github.com/Rendez/react-media-responsive/CODE_OF_CONDUCT.md).

## Motivation

Truly responsive design is *tricky*, and although React makes reasoning about responsive design very easy,
the difficulties grow when we reuse components' presentational logic. If your components' `render` method are like mine,
I am sure you'll be often faced complexities when rendering the same component for different resolutions. Often you ought to
leave out some menu items, or render a complete separate child depending on your device's orientation.

While there are some other projects already solving this [issue](https://github.com/akiran/react-responsive-mixin) [similarly](https://github.com/contra/react-responsive), I found a few problems, or outdated approaches and other stuff leading to code repetition I wasn't happy working with.

This new approach is the result of taking a different perspective on `react-responsive`. I wanted more flexibility on how to play within the `render()` method, and the possibility to reduce computational time as I dealt with responsiveness within my React components.

If we think of UI responsiveness as part of the state tree, then heavily reusable components become easy to reason about by encouraging the reduction of boilerplate and conditional statements that offer a powerful approach to complicated cases. Think of how easy then becomes, to pass prop value to a child component, and encapsulate other behaviors indirectly related to a media query... Flexibility is served!

## How it works

Glad you ask! Because this project has been inspired a great deal by [react-redux](https://github.com/reactjs/react-redux).
As a result, you'll probably find the next piece of code very familiar...

```jsx
import React from 'react'
import SampleApp from './SampleApp.js'
import { ResponsiveProvider } from './react-media-responsive'

const media = {
  tablet: {
    screen: true,
    minWidth: 768,
    maxWidth: 1024
  },
  fromTablet: {
    minWidth: '768px'
  },
  retina: {
    minResolution: '2dppx'
  },
  notLandscape: {
    orientation: 'portrait'
  }
}

export default (
  <ResponsiveProvider media={media}>
    <SampleApp />
  </ResponsiveProvider>
)

```

Good responsive designs are thought using breakpoints, orientation and a variety of other properties.
Therefore, you'll want to define these onto a `media` object, and pass it down to the `<ResponsiveProvider>`.

This wrapper uses your app's *context* to keep the state tree of media queries up to date, adding one listener for each
of the *named* breakpoints/changes you want to define. These *named* keys are your way into the responsive world.

We'll see next how this approach facilitates not only writing code to deal with your responsive design cases,
but also to be able to optimize each individual component using `shouldComponentUpdate()`.

## Usage

Just like `react-redux`, when we need *responsiveness*, we need to make that component *aware* of changes. Upon wrapping,
a component subscribes to the global `responsiveStore` that lives in the context, and will wait for matched media queries' changes.


```jsx
import React, { Component } from 'react';
import { responsive } from 'react-media-responsive';

class SampleApp extends Component {
  render() {
    const { responsive } = this.props;

    return (
      <div className={responsive.tablet ? 'isTablet' : ''} style={{fontSize: responsive.retina ? 22 : 16}}>
        {responsive.tablet ? (
          <span>
            I am a tablet
            {responsive.notLandscape ? (
              <span>, and I am NOT in landscape mode</span>
            ) : (
              <span>, and I am in landscape mode</span>
            )}
          </span>
        ) : (
          <span>I am NOT a tablet {responsive.fromTablet && '. However I am WIDER!'}</span>
        )}
      </div>
    );
  }
  /**
   * Comment out the next method to get an instant optimization boost, while resizing your browser window.
   * Note that store updates are already debounced, so use this method mindfully when you want that extra bit of performance.
   */
  //shouldComponentUpdate(nextProps) {
  //  const { fromTablet } = this.props.responsive;

  //  if (fromTablet !== nextProps.responsive.fromTablet) {
  //    return true;
  //  }
  //  return false;
  //}
}
export default responsive()(SampleApp);

```


#### Important note

The connector/wrapper should be the closest to the actual Component.
If you'd use **react-redux's** `connect()` method and then wrap it with `responsive()`, react-redux
would be made aware of new properties passed every time a media query matches, which is a small
performance penalty you can easily avoid:

**BAD**:
```jsx
export default responsive()(connect()(SampleApp));
```

**GOOD**:
```jsx
export default connect()(responsive()(SampleApp));
```

### Defining media queries

Embracing this project's brother repository, please refer to this complete list
with all possible shorthands and value types https://github.com/wearefractal/react-responsive/blob/master/src/mediaQuery.js#L9

Any numbers given as a shorthand will be expanded to px (`1234` will become `'1234px'`)

### Options

- `withRef {Boolean}` exposes the wrapper component with refs so that you may access it.
- `only {Array}` string values passed to this array will implement `shouldComponentUpdate` and trigger only a state change on the WrappedComponent when some value in it matches, ignoring any other updates in `values` passed to the ResponsiveProvider.

### Server rendering

Server rendering can be done by passing static values through the `values` property in the provider:

```jsx
export default (
  <ResponsiveProvider media={media} values={{width: 1024, minResolution: '2dppx'}}>
    <SampleApp />
  </ResponsiveProvider>
)
```

## Browser Support

### Out of the box

<table>
<tr>
<td>Chrome</td>
<td>9</td>
</tr>
<tr>
<td>Firefox (Gecko)</td>
<td>6</td>
</tr>
<tr>
<td>MS Edge</td>
<td>All</td>
</tr>
<tr>
<td>Internet Explorer</td>
<td>10</td>
</tr>
<tr>
<td>Opera</td>
<td>12.1</td>
</tr>
<tr>
<td>Safari</td>
<td>5.1</td>
</tr>
</table>

### With Polyfills

Just like [react-responsive](https://github.com/contra/react-responsive), we encourage you to use polyfills whenever extended browser support is required:

- [matchMedia.js by Paul Irish](https://github.com/paulirish/matchMedia.js/)
- [media-match (faster, but larger and lacking some features)](https://github.com/weblinc/media-match)
