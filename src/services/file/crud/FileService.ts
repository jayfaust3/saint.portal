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
        const response: Response  = await fetch(
            this._fileAPIBaseUrl, 
            { 
                method: 'POST', 
                headers: this._headers,
                body: JSON.stringify(file)
            }
        );

        return await this.parseResult<APIResponse<File>>(response);
    }

    public async getFile(bucketName: string, directory: string, name: string, contentType: string): Promise<APIResponse<File>> {
        const response: Response  = await fetch(
            `${this._fileAPIBaseUrl}?bucketName=${bucketName}&directory=${directory}&name=${name}&contentType=${contentType.replace('/', '|')}`, 
            { 
                method: 'GET', 
                headers: this._headers,
            }
        );

        return await this.parseResult<APIResponse<File>>(response);
    }
}
