export interface FileFormatDTO {
    mediaType: string;
    name: string;
}

class FileFormat {
    mediaType: string;
    name: string;

    constructor(params: FileFormatDTO) {
        this.mediaType = params.mediaType;
        this.name = params.name;
    }
}

export { FileFormat };
