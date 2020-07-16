import { IExtensionTypeObject } from '../../interfaces';
import EXTENSION_TYPE from '../enums/extensionType';
import { AttachmentService } from '../services/attachmentService';
import { FileFormat, FileFormatDTO } from './fileFormat';
import { FileVersion, FileVersionDTO } from './fileVersion';

export interface FileContainerDTO {
    availableFormats?: FileFormatDTO[];
    currentVersionUUID?: string;
    description?: string;
    fileSize?: number;
    lastModify?: number;
    mediaType?: string;
    nodeId: string;
    nodeName: string;
    version?: string;
    versions?: FileVersionDTO[];
}

class FileContainer {
    availableFormats?: FileFormat[];
    currentVersionUUID?: string;
    description?: string;
    fileSize?: number;
    lastModify?: number;
    mediaType?: string;
    nodeId: string;
    nodeName: string;
    version?: string;
    versions: FileVersion[];
    extensionType: IExtensionTypeObject;

    constructor(params: FileContainerDTO) {
        this.availableFormats = params.availableFormats
            ? params.availableFormats.map(format => new FileFormat(format))
            : [];
        this.currentVersionUUID = params.currentVersionUUID;
        this.description = params.description;
        this.fileSize = params.fileSize;
        this.lastModify = params.lastModify;
        this.mediaType = params.mediaType;
        this.nodeId = params.nodeId;
        this.nodeName = params.nodeName;
        this.version = params.version;
        this.versions = params.versions
            ? params.versions.map(version => new FileVersion(version))
            : [];
        this.extensionType = params.mediaType && EXTENSION_TYPE[AttachmentService.getFileExtensionFromMimeType(params.mediaType)
                                                             .toLowerCase()]
            ? EXTENSION_TYPE[AttachmentService.getFileExtensionFromMimeType(params.mediaType)
                                              .toLowerCase()]
            : (EXTENSION_TYPE[AttachmentService.getFileExtensionFromFullName(params.nodeName)
                                               .toLowerCase()]
                ? EXTENSION_TYPE[AttachmentService.getFileExtensionFromFullName(params.nodeName)
                                                  .toLowerCase()]
                : EXTENSION_TYPE.pdf);
    }
}

export { FileContainer };
