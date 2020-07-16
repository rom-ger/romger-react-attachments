import { Attachment } from './attachment';

export interface AttachmentsCheckResult {
    checkPassedAttachments: Attachment[];
    errors: string[];
}
