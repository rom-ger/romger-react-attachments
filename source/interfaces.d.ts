import { CancelToken } from 'axios';
import { FileContainer } from './models';

/**
 * TODO: Global
 */
interface CollectionDTOInterface<T> {
    items: T[];
    totalCount: number;
}

interface IExtensionTypeObject {
    iconPath: string;
    extension: string;
    isImage?: boolean;
    mimeTypes: string[];
    // Типы, которые используются для формирования значения accept для элемента input
    acceptTypes: string[];
    subExtensions?: string[];
}

interface Attachment {
    name: string;
    multiPartFile: File;
    size?: number;
}

interface IExtensionType {
    [value: string]: IExtensionTypeObject;

    jpg: IExtensionTypeObject;
    png: IExtensionTypeObject;
    gif: IExtensionTypeObject;
    bmp: IExtensionTypeObject;
    avi: IExtensionTypeObject;
    mov: IExtensionTypeObject;
    mpeg4: IExtensionTypeObject;
    mp3: IExtensionTypeObject;
    wav: IExtensionTypeObject;
    mp4: IExtensionTypeObject;
    pdf: IExtensionTypeObject;
    doc: IExtensionTypeObject;
    docx: IExtensionTypeObject;
    xls: IExtensionTypeObject;
    xlsx: IExtensionTypeObject;
    zip: IExtensionTypeObject;
    csv: IExtensionTypeObject;
    xml: IExtensionTypeObject;
    rdf: IExtensionTypeObject;
    txt: IExtensionTypeObject;
    rtf: IExtensionTypeObject;
    tiff: IExtensionTypeObject;
}

interface IAttachmentActions {
    getAllInfo(containersIds: string[]): Promise<CollectionDTOInterface<FileContainer>>;

    createAttachment(
        attachment: File,
        uploadProgressHandler?: (progressEvent: ProgressEvent) => any,
        cancelToken?: CancelToken,
        description?: string,
        author?: string,
    ): Promise<FileContainer>;

    getAllContainers(): Promise<CollectionDTOInterface<FileContainer>>;

    downloadAttachment(attachmentId: string, format?: string): void;

    copyContainer(containerId: string): Promise<FileContainer>;

    deleteContainer(containerId: string): Promise<any>;

    getContainerInfo(containerId: string): Promise<FileContainer>;

    getSrcAttachment(mimeType: string, attachmentId: string, callback: any, format?: string): void;

    getLinkAttachment(attachmentId: string, format?: string): string;

    downloadBinary(res: any, fileName?: string): void;
}

export {
    CollectionDTOInterface,
    IExtensionTypeObject,
    Attachment,
    IExtensionType,
    IAttachmentActions,
};
