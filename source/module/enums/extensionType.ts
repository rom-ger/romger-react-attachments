import { IExtensionType } from '../../interfaces';
import { TypeService } from '../services/typeService';

export enum ExtensionTypeEnum {
    jpg = 'jpg',
    png = 'png',
    gif = 'gif',
    bmp = 'bmp',
    avi = 'avi',
    mov = 'mov',
    mpeg4 = 'mpeg4',
    mp3 = 'mp3',
    wav = 'wav',
    mp4 = 'mp4',
    pdf = 'pdf',
    doc = 'doc',
    docx = 'docx',
    xls = 'xls',
    xlsx = 'xlsx',
    zip = 'zip',
    xml = 'xml',
    rdf = 'rdf',
    txt = 'txt',
    tiff = 'tiff',
    rtf = 'rtf',
}

const EXTENSION_TYPE: IExtensionType = {
    jpg: {
        iconPath: 'assets/images/svg/mime/jpg.svg',
        extension: 'jpg',
        isImage: true,
        mimeTypes: [
            'image/jpeg',
            'image/pjpeg',
        ],
        subExtensions: [
            'jpg',
            'jpeg',
            'JPG',
            'JPEG',
        ],
        acceptTypes: [
            'image/jpeg',
            'image/pjpeg',
        ],
    },
    png: {
        iconPath: 'assets/images/svg/mime/png.svg',
        extension: 'png',
        isImage: true,
        mimeTypes: [
            'image/png',
        ],
        acceptTypes: [
            'image/png',
        ],
    },
    gif: {
        iconPath: 'assets/images/svg/mime/gif.svg',
        extension: 'gif',
        isImage: true,
        mimeTypes: [
            'image/gif',
        ],
        acceptTypes: [
            'image/gif',
        ],
    },
    bmp: {
        iconPath: 'assets/images/svg/mime/bmp.svg',
        extension: 'bmp',
        isImage: true,
        mimeTypes: [
            'image/bmp',
            'image/x-windows-bmp',
        ],
        acceptTypes: [
            'image/bmp',
            'image/x-windows-bmp',
        ],
    },
    avi: {
        iconPath: 'assets/images/svg/mime/avi.svg',
        extension: 'avi',
        mimeTypes: [
            'application/x-troff-msvideo',
            'video/avi',
            'video/msvideo',
            'video/x-msvideo',
        ],
        acceptTypes: [
            'application/x-troff-msvideo',
            'video/avi',
            'video/msvideo',
            'video/x-msvideo',
        ],
    },
    mov: {
        iconPath: 'assets/images/svg/mime/mov.svg',
        extension: 'mov',
        mimeTypes: [
            'video/quicktime',
        ],
        acceptTypes: [
            'video/quicktime',
        ],
    },
    mpeg4: {
        iconPath: 'assets/images/svg/mime/mpeg4.svg',
        extension: 'mpeg4',
        mimeTypes: [
            'video/mpeg',
        ],
        acceptTypes: [
            'video/mpeg',
        ],
    },
    mp3: {
        iconPath: 'assets/images/svg/mime/mp3.svg',
        extension: 'mp3',
        mimeTypes: [
            'audio/mpeg3',
            'audio/x-mpeg-3',
        ],
        acceptTypes: [
            'audio/mpeg3',
            'audio/x-mpeg-3',
        ],
    },
    wav: {
        iconPath: 'assets/images/svg/mime/wav.svg',
        extension: 'wav',
        mimeTypes: [
            'audio/wav',
            'audio/x-wav',
        ],
        acceptTypes: [
            'audio/wav',
            'audio/x-wav',
        ],
    },
    mp4: {
        iconPath: 'assets/images/svg/mime/mp4.svg',
        extension: 'mp4',
        mimeTypes: [
            'video/mp4',
        ],
        acceptTypes: [
            'video/mp4',
        ],
    },
    pdf: {
        iconPath: 'assets/images/svg/mime/pdf.svg',
        extension: 'pdf',
        mimeTypes: [
            'application/pdf',
        ],
        acceptTypes: [
            'application/pdf',
        ],
    },
    doc: {
        iconPath: 'assets/images/svg/mime/doc.svg',
        extension: 'doc',
        mimeTypes: [
            'application/msword',
        ],
        acceptTypes: [
            'application/msword',
            '.doc',
        ],
    },
    docx: {
        iconPath: 'assets/images/svg/mime/docx.svg',
        extension: 'docx',
        mimeTypes: [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        acceptTypes: [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.docx',
        ],
    },
    xls: {
        iconPath: 'assets/images/svg/mime/xls.svg',
        extension: 'xls',
        mimeTypes: [
            'application/excel',
            'application/vnd.ms-excel',
            'application/x-excel',
            'application/x-msexcel',
        ],
        acceptTypes: [
            'application/excel',
            'application/vnd.ms-excel',
            'application/x-excel',
            'application/x-msexcel',
            '.xls',
        ],
    },
    xlsx: {
        iconPath: 'assets/images/svg/mime/xlsx.svg',
        extension: 'xlsx',
        mimeTypes: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        acceptTypes: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xlsx',
        ],
    },
    zip: {
        iconPath: 'assets/images/svg/mime/zip.svg',
        extension: 'zip',
        mimeTypes: [
            'application/zip',
        ],
        acceptTypes: [
            'application/zip',
        ],
    },
    xml: {
        iconPath: 'assets/images/svg/mime/zip.svg',
        extension: 'xml',
        mimeTypes: [
            'application/xml',
        ],
        acceptTypes: [
            'application/xml',
        ],
    },
    csv: {
        iconPath: 'assets/images/svg/mime/csv.svg',
        extension: 'csv',
        mimeTypes: [
            'text/csv',
        ],
        acceptTypes: [
            '.csv',
        ],
    },
    rdf: {
        iconPath: 'assets/images/svg/mime/rdf.svg',
        extension: 'rdf',
        mimeTypes: [
            'application/rdf+xml',
        ],
        acceptTypes: [
            'application/rdf+xml',
        ],
    },
    txt: {
        iconPath: 'assets/images/svg/mime/doc.svg',
        extension: 'txt',
        mimeTypes: [
            'image/plain',
        ],
        acceptTypes: [
            'image/plain',
        ],
    },
    rtf: {
        iconPath: 'assets/images/svg/mime/doc.svg',
        extension: 'rtf',
        mimeTypes: [
            'application/rtf',
        ],
        acceptTypes: [
            'application/rtf',
        ],
    },
    tiff: {
        iconPath: 'assets/images/svg/mime/png.svg',
        extension: 'tiff',
        isImage: true,
        mimeTypes: [
            'image/tiff',
        ],
        acceptTypes: [
            'image/tiff',
        ],
    },
};

export default EXTENSION_TYPE;

export const ExtensionTypeEnumType = TypeService.createEnum<ExtensionTypeEnum>(ExtensionTypeEnum, 'ExtensionTypeEnum');
