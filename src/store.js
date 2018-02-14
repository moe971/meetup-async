// @flow
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createEpicMiddleware } from 'redux-observable'


import uploader from './modules/uploader/uploader.reducer'
import uploaderSaga from './modules/uploader/uploader.saga'
import {uploaderEpic} from "./modules/uploader/uploader.epic";

const DEFAULT_STATE = {
}
const rootSagaMiddleware = createSagaMiddleware()
const epicMiddleware = createEpicMiddleware(uploaderEpic)
const enhancer = compose(
  // applyMiddleware(rootSagaMiddleware),
  applyMiddleware(epicMiddleware),
  typeof window !== 'undefined' && window.devToolsExtension
    ? window.devToolsExtension()
    : (x) => x
)

const store = createStore(
  uploader,
  DEFAULT_STATE, 
  enhancer
)

// rootSagaMiddleware.run(uploaderSaga)

export default store
