import { UserAuth } from '../../../models/security/UserContext';
import { APIResponse } from '../../../models/api/APIResponse';
import { File } from '../../../models/file/File';
import { BaseHTTPService } from '../../http/BaseHTTPService';

export class FileService extends BaseHTTPService {
    private readonly _fileAPIBaseUrl: string = '/api/files';

    constructor(auth: UserAuth) {
        super(auth);
    }

    public async postFile(file: File): Promise<APIResponse<File>> {
        return await this.makeRequest<APIResponse<File>>('POST', this._fileAPIBaseUrl, file);
    }

    public async getFile(bucketName: string, directory: string, name: string, contentType: string): Promise<APIResponse<File>> {
        const url: string = `${this._fileAPIBaseUrl}?bucketName=${bucketName}&directory=${directory}&name=${name}&contentType=${contentType.replace('/', '|')}`;
        
        return await this.makeRequest<APIResponse<File>>('GET', url);
    }
}
