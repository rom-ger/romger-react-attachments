import { CancelToken } from 'axios';
import { CollectionDTOInterface } from '../../interfaces';
import { FileContainer } from '../models/fileContainer';

export interface IAttachmentActions {
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
