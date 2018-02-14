/* @flow */
import { all, call, cancel, fork, put, takeEvery } from 'redux-saga/effects'
import { upload } from './uploader.service'

import type { tUploadRequested } from './uploader.model'

const mediabuffer = []
let uploadConcurency = 0

function* checkUploadJobSaga(action): Generator<*, *, *> {
  if (mediabuffer.length > 0) {
    yield uploadConcurency++
    yield fork(uploadMediaSaga, mediabuffer.shift())
  } else {
    uploadConcurency = 0
    yield put({
      type: 'JOB_UPLOAD_COMPLETE'
    })
  }
}

function* uploadMediaSaga(file): Generator<*, *, *> {
  try {
    const media = yield call(upload, file)
    yield uploadConcurency--
    yield put({
      type: 'UPLOAD_MEDIA_SUCCESS',
      media: media
    })
    yield put({
      type: 'JOB_UPLOAD_PROGRESS',
      label: file.name,
      success: true,
      progress: mediabuffer.length + uploadConcurency
    })
  } catch (error) {
    yield uploadConcurency--
    yield put({
      type: 'JOB_UPLOAD_ERROR',
      filename: file.name
    })
    yield put({
      type: 'JOB_UPLOAD_PROGRESS',
      label: file.name,
      success: false,
      progress: mediabuffer.length + uploadConcurency
    })
  }
}

function* runUploadJobSaga(action: tUploadRequested): Generator<*, *, *> {
  const { files } = action
  mediabuffer.push(...files)
  yield put({
    type: 'JOB_UPLOAD_STARTED',
    totalItems: mediabuffer.length + uploadConcurency
  })
  if (uploadConcurency === 3) yield cancel

  const buffer = mediabuffer.splice(0, 3 - uploadConcurency)
  yield (uploadConcurency += buffer.length)
  yield all(buffer.map(media => fork(uploadMediaSaga, media)))
}

export default function* rootUploaderSaga(): Generator<*, *, *> {
  yield all([
    //$FlowFixMe
    yield takeEvery('UPLOAD_REQUESTED', runUploadJobSaga),
    yield takeEvery('UPLOAD_MEDIA_SUCCESS', checkUploadJobSaga),
    yield takeEvery('JOB_UPLOAD_ERROR', checkUploadJobSaga)
  ])
}
