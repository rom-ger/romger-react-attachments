import * as t from 'io-ts';
import { IExtensionTypeObject } from '../../interfaces';
import EXTENSION_TYPE from '../enums/extensionType';
import { AttachmentService } from '../services/attachmentService';

export const EntityAttachmentType = t.interface({
    availableFormats: t.union([t.array(t.string), t.null]),
    mimeType: t.string,
    name: t.string,
    nodeId: t.string,
    size: t.number,
});

export interface EntityAttachmentDTO extends t.TypeOf<typeof EntityAttachmentType> {
}

export class EntityAttachment {
    availableFormats: string[] | null;
    mimeType: string;
    name: string;
    nodeId: string;
    size: number;
    extensionType: IExtensionTypeObject;

    constructor(params: EntityAttachmentDTO) {
        this.availableFormats = params.availableFormats;
        this.mimeType = params.mimeType;
        this.name = params.name;
        this.nodeId = params.nodeId;
        this.size = params.size;
        this.extensionType = EXTENSION_TYPE[AttachmentService.getFileExtensionFromMimeType(params.mimeType)
            .toLowerCase()] ? EXTENSION_TYPE[AttachmentService.getFileExtensionFromMimeType(params.mimeType)
                .toLowerCase()] : EXTENSION_TYPE.pdf;
    }
}
