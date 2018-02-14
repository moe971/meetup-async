// @flow
export type tUploadRequested = {
  type: 'UPLOAD_REQUESTED',
  files: Array<File>,
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
  type: 'JOB_UPLOAD_ERROR',
  filename: string
}

export type tJobUploadStarted = {
  type: 'JOB_UPLOAD_STARTED',
  path: string,
  totalItems: number
}