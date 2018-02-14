// @flow
import { DEFAULT_STATE } from '../../store'

import type { tState, Actions } from './uploader.model'

const reducer = (state: tState = DEFAULT_STATE, action: Actions): tState => {
  switch (action.type) {
    case 'UPLOAD_MEDIA_START':
      return {
        ...state,
        uploadConcurrency: state.uploadConcurrency + 1
      }
    case 'UPLOAD_MEDIA_SUCCESS':
      return {
        ...state,
        uploadConcurrency: state.uploadConcurrency - 1,
        progress: state.progress + 1,
        currentUpload: action.media.name
      }
    case 'UPLOAD_MEDIA_ERROR':
      return {
        ...state,
        uploadConcurrency: state.uploadConcurrency - 1,
        progress: state.progress + 1,
        currentUpload: action.filename,
        numErrors: state.numErrors + 1
      }
    case 'UPLOAD_REQUESTED':
      return {
        ...state,
        totalItems: state.totalItems + action.files.length
      }
    case 'JOB_UPLOAD_STARTED':
      return {
        ...state,
        uploading: true,
        progress: action.totalItems + state.uploadConcurrency
      }
    case 'JOB_UPLOAD_COMPLETE':
      return DEFAULT_STATE
    default:
      return state
  }
}

export default reducer
