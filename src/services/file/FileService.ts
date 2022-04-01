import { APIResponse } from '../../models/api/APIResponse';
import { File } from '../../models/file/File';

export class FileService {
    private readonly _headers: Headers;

    constructor() {
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json;charset=UTF-8');
        this._headers.append('Access-Control-Allow-Origin', '*');
        this._headers.append('Access-Control-Allow-Headers', '*');
        this._headers.append('Accept', 'application/json');
    }

    public async postFile(file: File): Promise<APIResponse<File>> {
        const responseBuffer: Response  = await fetch(
            '/files', 
            { 
                method: 'POST', 
                headers: this._headers,
                body: JSON.stringify(file)
            }
        );

        const apiResponse = await responseBuffer.json() as APIResponse<File>;

        return apiResponse;
    }

    public async getFile(fileUrl: string): Promise<APIResponse<File>> {
        const responseBuffer: Response  = await fetch(
            fileUrl, 
            { 
                method: 'GET', 
                headers: this._headers
            }
        );

        const apiResponse = await responseBuffer.json() as APIResponse<File>;

        return apiResponse;
    }
}
