import { UserAuth } from '../../../models/security/UserAuth';
import { APIResponse } from '../../../models/api/APIResponse';
import { BaseHTTPService } from '../../http/BaseHTTPService';

type TokenResponse = { token: string }

export class AuthService extends BaseHTTPService {
    private readonly _authAPIBaseUrl: string = '/api/auth';

    constructor(auth: UserAuth) {
        super(auth);
    }

    public async getToken(): Promise<APIResponse<TokenResponse>> {
        return await this.makeRequest<APIResponse<TokenResponse>>('GET', `${this._authAPIBaseUrl}/token`);
    }
}
