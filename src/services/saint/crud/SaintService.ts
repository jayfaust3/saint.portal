import { UserAuth } from '../../../models/security/UserContext';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { BaseHTTPService } from '../../http/BaseHTTPService';

export class SaintService extends BaseHTTPService {
    private readonly _saintAPIBaseUrl: string = '/api/saints';

    constructor(auth: UserAuth) {
        super(auth)
    }

    public async getAll(): Promise<APIResponse<Array<Saint>>> {
        const response: Response = await fetch(
            this._saintAPIBaseUrl,
            {
                method: 'GET',
                headers:  this._headers
            }
        );

        return await this.parseResult<APIResponse<Array<Saint>>>(response);

        // return Promise.resolve({ data: [] });
    }

    public async get(id: string): Promise<APIResponse<Saint>> {
        const response: Response = await fetch(
            `${this._saintAPIBaseUrl}/${id}`,
            {
                method: 'GET',
                headers: this._headers
            }
        );

        return await this.parseResult<APIResponse<Saint>>(response);
    }

    public async post(payload: Saint): Promise<APIResponse<Saint>> {
        const response: Response = await fetch(
            this._saintAPIBaseUrl,
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
            `${this._saintAPIBaseUrl}/${id}`,
            {
                method: 'PUT',
                headers: this._headers,
                body: JSON.stringify(payload)
            }
        );

        return await this.parseResult<APIResponse<Saint>>(response);
    }
}
