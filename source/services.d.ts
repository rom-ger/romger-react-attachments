import { Attachment } from './interfaces';

interface TransliterationServiceInterface {
    transliterate(string: string): string;
}

declare const TransliterationService: TransliterationServiceInterface;

interface AttachmentServiceInterface {
    getFileField(file: File): Attachment;

    getSizeText(byte: number): string;

    modRound(value: any, precision: any): number;

    getFileExtensionFromFullName(fullName: string): string;
}

declare const AttachmentService: AttachmentServiceInterface;

export {
    TransliterationService,
    AttachmentService,
};
