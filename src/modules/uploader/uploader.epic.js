// @flow
import Rx from 'rxjs/Rx'
import { merge } from 'rxjs/observable/merge'
import { upload } from './uploader.service'
import type { Epic } from './uploader.model'

const mediabuffer = []

const uploadMedia = file =>
  Rx.Observable.fromPromise(upload(file))
    .mergeMap(media =>
      Rx.Observable.of({
        type: 'UPLOAD_MEDIA_SUCCESS',
        media: media
      })
    )
    .catch(() => Rx.Observable.of({
        type: 'UPLOAD_MEDIA_ERROR',
        filename: file.name
      }))
    .startWith({
      type: 'UPLOAD_MEDIA_START'
    })

const requestsEpic = (actions$, { getState })  => actions$
  .ofType('UPLOAD_REQUESTED')
  .mergeMap(action => {
    mediabuffer.push(...action.files)
    const { uploadConcurrency } = getState()
    if (uploadConcurrency === 3) {
      return Rx.Observable.of({
        type: 'JOB_UPLOAD_STARTED',
        totalItems: mediabuffer.length
      })
    }
    const buffer = mediabuffer.splice(0, 3 - uploadConcurrency)
    return merge(...buffer.map(uploadMedia)).startWith({
      type: 'JOB_UPLOAD_STARTED',
      totalItems: mediabuffer.length
    })
  })


const completionsEpic = actions$ =>
  actions$
  .ofType('UPLOAD_MEDIA_SUCCESS', 'JOB_UPLOAD_ERROR')
  .mergeMap(() => {
    if (mediabuffer.length > 0) {
      return uploadMedia(mediabuffer.shift())
    } else {
      return Rx.Observable.of({
        type: 'JOB_UPLOAD_COMPLETE'
      })
    }
  })

export const uploaderEpic: Epic = (actions$, store) => {
  return merge(requestsEpic(actions$, store), completionsEpic(actions$))
}
