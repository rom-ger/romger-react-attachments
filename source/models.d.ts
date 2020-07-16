import * as t from 'io-ts';
import { IExtensionTypeObject } from './interfaces';

declare const EntityAttachmentType: t.TypeC<{
    availableFormats: t.UnionC<[t.ArrayC<t.StringC>, t.NullC]>;
    mimeType: t.StringC;
    name: t.StringC;
    nodeId: t.StringC;
    size: t.NumberC;
}>;

declare class EntityAttachment {
    availableFormats: string[] | null;
    mimeType: string;
    name: string;
    nodeId: string;
    size: number;
    extensionType: IExtensionTypeObject;

    constructor(params: EntityAttachmentDTO);
}

interface EntityAttachmentDTO extends t.TypeOf<typeof EntityAttachmentType> {
}

declare class FileFormat {
    mediaType: string;
    name: string;

    constructor(params: FileFormatDTO);
}

interface FileFormatDTO {
    mediaType: string;
    name: string;
}

declare class FileVersion {
    author: string;
    created: number;
    fileName: string;
    fileSize: number;
    mediaType: string;
    version: string;
    versionId: string;
    extensionType: IExtensionTypeObject;

    constructor(params: FileVersionDTO);
}

interface FileVersionDTO {
    author: string;
    created: number;
    fileName: string;
    fileSize: number;
    mediaType: string;
    version: string;
    versionId: string;
}

declare class FileContainer {
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

    constructor(params: FileContainerDTO);
}

interface FileContainerDTO {
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

export {
    EntityAttachment, EntityAttachmentDTO, EntityAttachmentType,
    FileFormat, FileFormatDTO,
    FileVersion, FileVersionDTO,
    FileContainer, FileContainerDTO,
};
