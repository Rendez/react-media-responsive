import { jsdom } from 'jsdom'
import matchMedia from 'matchmedia'

global.document = jsdom('<!doctype html><html><body><div id="app"></div></body></html>')
global.window = document.defaultView
global.navigator = global.window.navigator

global.window.matchMedia = matchMedia
