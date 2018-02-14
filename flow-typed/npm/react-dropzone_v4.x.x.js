// flow-typed signature: db54e0fb617d876529ed4a11aecc3630
// flow-typed version: 9e8f6b2f55/react-dropzone_v4.x.x/flow_>=v0.53.x

declare module "react-dropzone" {
  declare type ChildrenProps = {
    draggedFiles: Array<File>,
    acceptedFile: Array<File>,
    rejectedFiles: Array<File>,
    isDragActive: boolean,
    isDragAccept: boolean,
    isDragReject: boolean,
  }

  declare type DropzoneProps = {
    accept?: string,
    children?: React$Node | (ChildrenProps) => React$Node,
    disableClick?: boolean,
    disabled?: boolean,
    disablePreview?: boolean,
    preventDropOnDocument?: boolean,
    inputProps?: Object,
    multiple?: boolean,
    name?: string,
    maxSize?: number,
    minSize?: number,
    className?: string,
    activeClassName?: string,
    acceptClassName?: string,
    rejectClassName?: string,
    disabledClassName?: string,
    style?: Object,
    activeStyle?: Object,
    acceptStyle?: Object,
    rejectStyle?: Object,
    disabledStyle?: Object,
    onClick?: (event: SyntheticMouseEvent<>) => mixed,
    onDrop?: (acceptedFiles: Array<File>, rejectedFiles: Array<File>, event: SyntheticDragEvent<>) => mixed,
    onDropAccepted?: (acceptedFiles: Array<File>, event: SyntheticDragEvent<>) => mixed,
    onDropRejected?: (rejectedFiles: Array<File>, event: SyntheticDragEvent<>) => mixed,
    onDragStart?: (event: SyntheticDragEvent<>) => mixed,
    onDragEnter?: (event: SyntheticDragEvent<>) => mixed,
    onDragOver?: (event: SyntheticDragEvent<>) => mixed,
    onDragLeave?: (event: SyntheticDragEvent<>) => mixed,
    onFileDialogCancel?: () => mixed,
  };

  declare module.exports: React$ComponentType<DropzoneProps>;
}
