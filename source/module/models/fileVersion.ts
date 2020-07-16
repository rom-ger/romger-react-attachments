import { IExtensionTypeObject } from '../../interfaces';
import EXTENSION_TYPE from '../enums/extensionType';
import { AttachmentService } from '../services/attachmentService';

export interface FileVersionDTO {
    author: string;
    created: number;
    fileName: string;
    fileSize: number;
    mediaType: string;
    version: string;
    versionId: string;
}

class FileVersion {
    author: string;
    created: number;
    fileName: string;
    fileSize: number;
    mediaType: string;
    version: string;
    versionId: string;
    extensionType: IExtensionTypeObject;

    constructor(params: FileVersionDTO) {
        this.author = params.author;
        this.created = params.created;
        this.fileName = params.fileName;
        this.fileSize = params.fileSize;
        this.mediaType = params.mediaType;
        this.version = params.version;
        this.versionId = params.versionId;
        this.extensionType = EXTENSION_TYPE[AttachmentService.getFileExtensionFromMimeType(params.mediaType)
            .toLowerCase()] ? EXTENSION_TYPE[AttachmentService.getFileExtensionFromMimeType(params.mediaType)
                .toLowerCase()] : EXTENSION_TYPE.pdf;
    }
}

export { FileVersion };
