// @flow
import Rx from 'rxjs/Rx'
import { merge } from 'rxjs/observable/merge'
import { upload } from './uploader.service'
import type { Epic } from './uploader.model'

let uploadConcurrency = 0
const mediabuffer = []

const uploadMedia = file => Rx.Observable
  .fromPromise(upload(file))
  .do(console.log)
  .do(() => uploadConcurrency--)
  .mergeMap(media => Rx.Observable.of(
    {
      type: 'UPLOAD_MEDIA_SUCCESS',
      media: media
    },
    {
      type: 'JOB_UPLOAD_PROGRESS',
      label: file.name,
      success: true,
      progress: mediabuffer.length + uploadConcurrency
    }
  ))
  .catch(() => {
    uploadConcurrency--
    return Rx.Observable.of(
      {
        type: 'JOB_UPLOAD_ERROR',
        filename: file.name
      },
      {
        type: 'JOB_UPLOAD_PROGRESS',
        label: file.name,
        success: false,
        progress: mediabuffer.length + uploadConcurrency
      }
    )
  })

const requestsEpic = actions$ => actions$
  .ofType('UPLOAD_REQUESTED')
  .mergeMap(action => {
    mediabuffer.push(...action.files)

    if (uploadConcurrency === 3) {
      return Rx.Observable.of({
        type: 'JOB_UPLOAD_STARTED',
        totalItems: mediabuffer.length + uploadConcurrency
      })
    }

    const buffer = mediabuffer.splice(0, 3 - uploadConcurrency)
    uploadConcurrency += buffer.length

    return merge(...buffer.map(uploadMedia))
  })

const completionsEpic = actions$ => actions$
  .ofType('UPLOAD_MEDIA_SUCCESS', 'JOB_UPLOAD_ERROR')
  .mergeMap(() => {
    if (mediabuffer.length > 0) {
      uploadConcurrency++
      return uploadMedia(mediabuffer.shift())
    } else {
      uploadConcurrency = 0
      return Rx.Observable.of({
        type: 'JOB_UPLOAD_COMPLETE'
      })
    }
  })

export const uploaderEpic: Epic = (actions$) => {
  return merge(
    requestsEpic(actions$),
    completionsEpic(actions$)
  )
}
