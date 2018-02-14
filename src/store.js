// @flow
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import uploader from './modules/uploader/uploader.reducer'
import uploaderSaga from './modules/uploader/uploader.saga'

const DEFAULT_STATE = {
}
const rootSagaMiddleware = createSagaMiddleware()
const enhancer = compose(
  applyMiddleware(rootSagaMiddleware),
  typeof window !== 'undefined' && window.devToolsExtension
    ? window.devToolsExtension()
    : (x) => x
)

const store = createStore(
  uploader,
  DEFAULT_STATE, 
  enhancer
)

rootSagaMiddleware.run(uploaderSaga)

export default store
