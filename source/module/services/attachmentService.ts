import { Attachment } from '../../interfaces';
import EXTENSION_TYPE from '../../module/enums/extensionType';

/*eslint no-magic-numbers: [2, { "ignore": [1024,1048576] }]*/

export class AttachmentService {

    static BYTE_OF_KILOBYTE = 1024;
    static BYTE_OF_MEGABYTE = 1048576;

    /**
     * Получить необходимую информацию по файлу
     * @param {*} file
     */
    static getFileField(file: File): Attachment {
        let result: Attachment = {
            name: file.name,
            multiPartFile: file,
            size: file.size,
        };
        return result;
    }

    /**
     * Получить размер файла
     * @param {*} byte
     */
    static getSizeText(byte: number): string {
        let modRoundNum = 2;

        if (byte < AttachmentService.BYTE_OF_KILOBYTE) {
            return `${byte} байт`;
        }

        if (byte < AttachmentService.BYTE_OF_MEGABYTE) {
            return `${this.modRound((byte / AttachmentService.BYTE_OF_KILOBYTE), modRoundNum)} КБ`;
        }

        return `${this.modRound((byte / AttachmentService.BYTE_OF_MEGABYTE), modRoundNum)} МБ`;
    }

    /**
     * Округлить число
     * @param {*} value
     * @param {*} precision
     */
    static modRound(value: any, precision: any): number {
        let powNum = 10;
        let precisionNumber = Math.pow(powNum, precision);
        return Math.round(value * precisionNumber) / precisionNumber;
    }

    /**
     * Получить расширение файла из полного имени файла
     */
    static getFileExtensionFromFullName(fullName: string): string {
        let splittedFullName = fullName.split('.');
        if (!splittedFullName.length) {
            return '';
        }
        let extension: string = splittedFullName[splittedFullName.length - 1];
        let findExtension: string = EXTENSION_TYPE.pdf.extension;
        let typeArray = Object.values(EXTENSION_TYPE);
        typeArray.forEach((el: any) => {
            if (el.extension === extension || (el.subExtensions && el.subExtensions.findIndex((subExtension: string) => subExtension === extension) !== -1)) {
                findExtension = el.extension;
            }
        });
        return findExtension;
    }

    /**
     * Получить расширение файла из mimeType
     */
    static getFileExtensionFromMimeType(mimeType?: string): string {
        let extension: string = EXTENSION_TYPE.pdf.extension;
        let typeArray = Object.values(EXTENSION_TYPE);
        typeArray.forEach((el: any) => {
            if (el.mimeTypes.findIndex((t: string) => t === mimeType) !== -1) {
                extension = el.extension;
            }
        });
        return extension;
    }
}
