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

    public async getFile(bucketName: string, name: string): Promise<APIResponse<File>> {
        const fileUrlResponseBuffer: Response  = await fetch(
            `/files?bucketName=${bucketName}&name=${name}`, 
            { 
                method: 'GET', 
                headers: this._headers,
            }
        );

        const fileServerApiResponse = await fileUrlResponseBuffer.json() as APIResponse<string>;

        const s3Url: string = fileServerApiResponse.data.replace('http://', '/');

        const s3RequestHeaders = new Headers();
        s3RequestHeaders.append('Access-Control-Allow-Origin', '*');
        s3RequestHeaders.append('Access-Control-Allow-Headers', '*');

        const s3UrlResponseBuffer: Response  = await fetch(
            s3Url, 
            { 
                method: 'GET',
                headers: s3RequestHeaders
            }
        );

        const s3Response = await s3UrlResponseBuffer.json();

        const s3ResponseBody = s3Response.Body as Buffer;

        return {
            data: {
                bucketName,
                name,
                content: s3ResponseBody.toString('base64')
            }
        };
    }
}
