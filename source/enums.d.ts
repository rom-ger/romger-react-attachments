import * as t from 'io-ts';
import { IExtensionType } from './interfaces';

declare enum ExtensionTypeEnum {
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
    csv = 'csv',
    xml = 'xml',
    txt = 'txt',
    tiff = 'tiff',
    rtf = 'rtf',
}

declare const EXTENSION_TYPE: IExtensionType;
declare const ExtensionTypeEnumType: t.Type<ExtensionTypeEnum, ExtensionTypeEnum, unknown>;

export {
    EXTENSION_TYPE, ExtensionTypeEnum, ExtensionTypeEnumType,
};
