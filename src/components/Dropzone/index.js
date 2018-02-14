/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import accepts from 'attr-accept'

import style from './Dropzone.css'

import type { Dispatch } from 'redux'
import type { tUploadRequested } from '../../modules/uploader/uploader.model'
import type {
  tDropzoneDrop,
  tDropzoneDragEnter,
  tDropzoneDragLeave
} from './dropzone.model'

type Actions =
  | tUploadRequested
  | tDropzoneDrop
  | tDropzoneDragEnter
  | tDropzoneDragLeave

type Props = {
  dispatch: Dispatch<Actions>,
  isDragging: boolean
}

class MSDropzone extends Component<Props> {
  filesBuffer = []

  fileAccepted(file: File) {
    return accepts(
      file,
      '.svg,.ai,.psd,.eps,.bmp,.cr2,.gif,.jpg,.jpeg,.png,.tif,.tiff'
    )
  }

  // Goes through the directory, and adds each file it finds recursively
  addFilesFromDirectory = (directory: Object, path: string) => {
    const { dispatch } = this.props
    let dirReader = directory.createReader()
    const readEntries = () => {
      return dirReader.readEntries(
        entries => {
          if (entries.length > 0) {
            for (let entry of entries) {
              if (entry.isFile) {
                entry.file(file => {
                  file.fullPath = `${path}/${file.name}`
                  if (this.fileAccepted(file)) {
                    dispatch({
                      type: 'UPLOAD_REQUESTED',
                      files: [file]
                    })
                    dispatch({ type: 'DROPZONE_DROP' })
                  }
                })
              } else if (entry.isDirectory) {
                this.addFilesFromDirectory(entry, `${path}/${entry.name}`)
              }
            }
            readEntries()
            return null
          }
        },
        () => {
          console.error('Error on directory browse')
        }
      )
    }
    return readEntries()
  }

  handleDrop = (
    acceptedFiles: Array<File>,
    rejectedFiles: Array<File>,
    e: Object
  ) => {
    const { dispatch } = this.props
    dispatch({ type: 'DROPZONE_DROP' })
    dispatch({
      type: 'UPLOAD_REQUESTED',
      files: acceptedFiles
    })
  }

  handleDragEnter = () => {
    this.props.dispatch({ type: 'DROPZONE_DRAG_ENTER' })
  }

  handleDragLeave = () => {
    this.props.dispatch({ type: 'DROPZONE_DRAG_LEAVE' })
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleDrop}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        className={style.dropzoneDefault}
        activeClassName={style.dropzoneActive}
        rejectClassName={style.dropzoneReject}
        multiple
      >
        {({ isDragActive, isDragReject }) => {
          if (isDragActive) {
            return <div>All files will be accepted</div>
          }
          if (isDragReject) {
            return <div>Some files will be rejected</div>
          }
          return <div>Drop files here...</div>
        }}
      </Dropzone>
    )
  }
}

const mapStateToProps = () => ({ isDragging: false })

export default connect(mapStateToProps)(MSDropzone)
