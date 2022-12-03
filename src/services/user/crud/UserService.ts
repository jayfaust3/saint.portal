import { UserAuth } from '../../../models/security/UserAuth';
import { APIResponse } from '../../../models/api/APIResponse';
import { User } from '../../../models/user/User';
import { BaseHTTPService } from '../../http/BaseHTTPService';
import { PageToken } from '../../../models/api/PageToken';

export class UserService extends BaseHTTPService {
    private readonly _userAPIBaseUrl: string = '/api/users';

    constructor(auth: UserAuth) {
        super(auth)
    }

    public async getAll(pageToken: PageToken): Promise<APIResponse<Array<User>>> {
        const tokenJSON = JSON.stringify(pageToken);
        const encodedToken = Buffer.from(tokenJSON).toString('base64');
        return await this.makeRequest<APIResponse<Array<User>>>('GET', `${this._userAPIBaseUrl}/${encodedToken}`);
    }

    public async get(id: string): Promise<APIResponse<User>> {
        return await this.makeRequest<APIResponse<User>>('GET', `${this._userAPIBaseUrl}/${id}`);
    }

    public async post(payload: User): Promise<APIResponse<User>> {
        return await this.makeRequest<APIResponse<User>>('POST', this._userAPIBaseUrl, payload);
    }
}
