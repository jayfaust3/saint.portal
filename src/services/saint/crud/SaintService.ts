import { UserAuth } from '../../../models/security/UserContext';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';

export class SaintService {
    private readonly _headers: Headers;

    constructor(auth: UserAuth) {
        this._headers = new Headers();
        this._headers.append('Access-Control-Allow-Origin', '*');
        this._headers.append('Access-Control-Allow-Headers', '*');
        this._headers.append('Accept', 'application/json');
        this._headers.append('Authorization', `Bearer ${auth.id_token}`);
        this._headers.append('Content-Type', 'application/json;charset=UTF-8');
    }

    public async getAll(): Promise<APIResponse<Array<Saint>>> {
        const response: Response = await fetch(
            '/saints',
            {
                method: 'GET',
                headers:  this._headers
            }
        );

        return await this.parseResult<APIResponse<Array<Saint>>>(response);
    }

    public async get(id: string): Promise<APIResponse<Saint>> {
        const response: Response = await fetch(
            `/saints/${id}`,
            {
                method: 'GET',
                headers: this._headers
            }
        );

        return await this.parseResult<APIResponse<Saint>>(response);
    }

    public async post(payload: Saint): Promise<APIResponse<Saint>> {
        const response: Response = await fetch(
            '/saints',
            {
                method: 'POST',
                headers: this._headers,
                body: JSON.stringify(payload)
            }
        );

        return await this.parseResult<APIResponse<Saint>>(response);
    }

    public async put(id: string, payload: Saint): Promise<APIResponse<Saint>> {
        const response: Response = await fetch(
            `/saints/${id}`,
            {
                method: 'PUT',
                headers: this._headers,
                body: JSON.stringify(payload)
            }
        );

        return await this.parseResult<APIResponse<Saint>>(response);
    }

    private async parseResult<TResult>(response: Response): Promise<TResult> {
        const data = await response.json() as TResult;

        return data;
    }
}
