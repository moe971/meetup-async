// @flow
import Rx from 'rxjs/Rx'

export type tState = {
  uploadConcurrency: number,
  uploading: boolean,
  progress: number,
  totalItems: number,
  numErrors: number
}

export type tUploadRequested = {
  type: 'UPLOAD_REQUESTED',
  files: Array<File>
}

export type tJobUploadComplete = {
  type: 'JOB_UPLOAD_COMPLETE'
}

export type tUploadMediaSuccess = {
  type: 'UPLOAD_MEDIA_SUCCESS',
  media: Object
}

export type tJobUploadProgress = {
  type: 'JOB_UPLOAD_PROGRESS',
  label: string,
  success: boolean,
  progress: number
}

export type tUploadMediaError = {
  type: 'UPLOAD_MEDIA_ERROR',
  filename: string
}

export type tJobUploadStarted = {
  type: 'JOB_UPLOAD_STARTED',
  path: string,
  totalItems: number
}

export type tUploadMediaStart = {
  type: 'UPLOAD_MEDIA_START'
}

export type Actions =
  | tUploadRequested
  | tJobUploadComplete
  | tUploadMediaSuccess
  | tJobUploadProgress
  | tUploadMediaError
  | tJobUploadStarted
  | tUploadMediaStart

// export type Action = {| +type: string |}

export type State = {}
export type GetState = () => State
export type Store = { getState: GetState }
export type ActionsObservable = Rx.Observable<Actions>
export type Epic = (ActionsObservable, Store) => ActionsObservable
export type Selector<T> = State => T
export type Reducer<S> = (S, Actions) => S
