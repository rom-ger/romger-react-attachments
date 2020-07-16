import * as React from 'react';
import { IAttachmentActions, IExtensionTypeObject } from './interfaces';
import { EntityAttachment, FileContainer } from './models';

interface IAttachmentsListProps {
    // with cs-service
    value?: string[];
    attachmentActions?: IAttachmentActions;
    onChange?: (attachmentIds: string[]) => void;
    availableAttachmentsExtensions?: IExtensionTypeObject[];

    // Работа с multipart
    localMultipartMode?: boolean;
    onChangeMultipart?: (files: File[]) => void;

    // common params
    dragNDropTitle?: string;
    disableDragNDrop?: boolean;
    showIncludeToast?: boolean;
    availableAttachmentsCount?: number;
    availableAttachmentsTotalSize?: number;

    hideRemoveAttachmentButton?: boolean;
    hideLoadMoreBlock?: boolean;
    hideEmptyBlock?: boolean;
    hideWarningLabel?: boolean;
    withoutBorder?: boolean;

    onUploadErrors?: (errors: string[]) => any;
    toggleIsLoadingStatus?: (uploadLock: boolean) => void;
}

declare class AttachmentsList extends React.Component<IAttachmentsListProps, any> {
    openFileSelectDialog(): void;
    resetComponentAttachments(): void;
}

interface IAttachmentsListViewProps {
    attachmentActions: IAttachmentActions;
    attachments?: EntityAttachment[];
    containers?: FileContainer[];
    attachmentsIds?: string[];
    withoutTitle?: boolean;
    showImage?: boolean;
}

declare class AttachmentsListView extends React.Component<IAttachmentsListViewProps, any> {
}

interface IImageViewerProps {
    attachmentActions: IAttachmentActions;
    fileContainerId?: string | null;
    allContainerIds?: string[];
    url?: string | null;
    onClose: () => void;
}

declare class ImageViewer extends React.Component<IImageViewerProps, any> {
}

interface IImageGalleryProps {
    attachmentActions?: IAttachmentActions;
    attachments?: EntityAttachment[];
    containers?: FileContainer[];
    attachmentsIds?: string[];
    imagesUrl?: string[];
    enableDotsControl?: boolean;
    enableArrowsControl?: boolean;
    showBackgroundBlur?: boolean;
    imageChangeInterval?: number;
    enableImagePreview?: boolean;
}

declare class ImageGallery extends React.Component<IImageGalleryProps, any> {
}

export {
    AttachmentsList,
    AttachmentsListView,
    ImageViewer,
    ImageGallery,
};
