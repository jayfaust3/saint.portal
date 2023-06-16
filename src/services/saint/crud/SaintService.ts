import { UserAuth } from '../../../models/security/UserAuth';
import { APIResponse } from '../../../models/api/APIResponse';
import { Saint } from '../../../models/saint/Saint';
import { BaseHTTPService } from '../../http/BaseHTTPService';

export class SaintService extends BaseHTTPService {
    private readonly _saintAPIBaseUrl: string = '/api/saints';

    constructor(auth: UserAuth) {
        super(auth)
    }

    public async getAll(): Promise<APIResponse<Array<Saint>>> {
        return await this.makeRequest<APIResponse<Array<Saint>>>('GET', this._saintAPIBaseUrl);
    }

    public async get(id: string): Promise<APIResponse<Saint>> {
        return await this.makeRequest<APIResponse<Saint>>('GET', `${this._saintAPIBaseUrl}/${id}`);
    }

    public async post(payload: Saint): Promise<APIResponse<Saint>> {
        return await this.makeRequest<APIResponse<Saint>>('POST', this._saintAPIBaseUrl, payload);
    }

    public async put(id: string, payload: Saint): Promise<APIResponse<Saint>> {
        return await this.makeRequest<APIResponse<Saint>>('PUT', `${this._saintAPIBaseUrl}/${id}`, payload);
    }

    public async delete(id: string): Promise<APIResponse<never>> {
        return await this.makeRequest<APIResponse<never>>('DELETE', `${this._saintAPIBaseUrl}/${id}`);
    }
}
