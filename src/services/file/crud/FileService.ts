import { UserAuth } from '../../../models/security/UserContext';
import { APIResponse } from '../../../models/api/APIResponse';
import { File } from '../../../models/file/File';

export class FileService {
    private readonly _fileAPIBaseUrl: string = '/api/files';
    private readonly _headers: Headers;

    constructor(auth: UserAuth) {
        this._headers = new Headers();
        this._headers.append('Accept', 'application/json');
        this._headers.append('Access-Control-Allow-Headers', '*');
        this._headers.append('Access-Control-Allow-Origin', '*');
        this._headers.append('Authorization', `Bearer ${auth.id_token}`);
        this._headers.append('Content-Type', 'application/json;charset=UTF-8');
    }

    public async postFile(file: File): Promise<APIResponse<File>> {
        const responseBuffer: Response  = await fetch(
            this._fileAPIBaseUrl, 
            { 
                method: 'POST', 
                headers: this._headers,
                body: JSON.stringify(file)
            }
        );

        const apiResponse = await responseBuffer.json() as APIResponse<File>;

        return apiResponse;
    }

    public async getFile(bucketName: string, directory: string, name: string, contentType: string): Promise<APIResponse<File>> {
        const responseBuffer: Response  = await fetch(
            `${this._fileAPIBaseUrl}?bucketName=${bucketName}&directory=${directory}&name=${name}&contentType=${contentType.replace('/', '|')}`, 
            { 
                method: 'GET', 
                headers: this._headers,
            }
        );

        const apiResponse = await responseBuffer.json() as APIResponse<File>;

        return {
            data: {
                bucketName,
                directory,
                name,
                contentType,
                content: apiResponse.data.content
            }
        };
    }
}
