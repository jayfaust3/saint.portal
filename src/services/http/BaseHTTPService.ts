import { UserAuth } from '../../models/security/UserContext';
import { APIResponse } from '../../models/api/APIResponse';

export abstract class BaseHTTPService {
    protected readonly _headers: Headers;

    protected constructor(auth: UserAuth) {
        this._headers = new Headers();
        this._headers.append('Accept', 'application/json');
        this._headers.append('Access-Control-Allow-Headers', '*');
        this._headers.append('Access-Control-Allow-Origin', '*');
        this._headers.append('Authorization', `Bearer ${auth.id_token}`);
        this._headers.append('Content-Type', 'application/json;charset=UTF-8');
    }

    protected async parseResult<TResult>(response: Response): Promise<TResult> {
        const data = await response.json() as TResult;

        return data;
    }
}
