/* @flow */
import {
  all,
  call,
  cancel,
  fork,
  put,
  takeEvery,
  select
} from 'redux-saga/effects'
import { upload } from './uploader.service'

import type { tUploadRequested, tState } from './uploader.model'

const mediabuffer = []

function* checkUploadJobSaga(action): Generator<*, *, *> {
  if (mediabuffer.length > 0) yield fork(uploadMediaSaga, mediabuffer.shift())
  const uploadConcurrency = yield select(
    ({ uploadConcurrency }): tState => uploadConcurrency
  )
  if (uploadConcurrency === 0) yield put({
    type: 'JOB_UPLOAD_COMPLETE'
  })
}

function* uploadMediaSaga(file): Generator<*, *, *> {
  try {
    yield put({
      type: 'UPLOAD_MEDIA_START'
    })
    const media = yield call(upload, file)
    yield put({
      type: 'UPLOAD_MEDIA_SUCCESS',
      media: media
    })
  } catch (error) {
    yield put({
      type: 'UPLOAD_MEDIA_ERROR',
      filename: file.name
    })
  }
}

function* runUploadJobSaga(action: tUploadRequested): Generator<*, *, *> {
  const { files } = action
  mediabuffer.push(...files)
  yield put({
    type: 'JOB_UPLOAD_STARTED',
    totalItems: mediabuffer.length
  })
  const uploadConcurrency = yield select(
    ({ uploadConcurrency }): tState => uploadConcurrency
  )
  if (uploadConcurrency === 3) yield cancel

  const buffer = mediabuffer.splice(0, 3 - uploadConcurrency)
  yield all(buffer.map(media => fork(uploadMediaSaga, media)))
}

export default function* rootUploaderSaga(): Generator<*, *, *> {
  yield all([
    //$FlowFixMe
    yield takeEvery('UPLOAD_REQUESTED', runUploadJobSaga),
    yield takeEvery(
      ['UPLOAD_MEDIA_SUCCESS', 'JOB_UPLOAD_ERROR'],
      checkUploadJobSaga
    )
  ])
}
