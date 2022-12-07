import { UserAuth } from '../../models/security/UserAuth';

export abstract class BaseHTTPService {
    protected readonly _headers: Headers;

    protected constructor(auth: UserAuth) {
        this._headers = new Headers();

        this._headers.append('Accept', 'application/json');
        this._headers.append('Access-Control-Allow-Headers', '*');
        this._headers.append('Access-Control-Allow-Origin', '*');

        if (auth.apiKey)
            this._headers.append('Authorization', `ApiKey ${auth.apiKey}`);
        else
            this._headers.append('Authorization', `Bearer ${auth.id_token}`);

        this._headers.append('Content-Type', 'application/json;charset=UTF-8');
    }

    protected async makeRequest<TResult>(httpMethod: string, url: string, payload?: unknown, headers?: Headers): Promise<TResult> {
        let body: string | undefined;

        if (payload) body = JSON.stringify(payload);
        
        const response: Response = await fetch(
            url, 
            { 
                method: httpMethod, 
                headers: headers ?? this._headers,
                body: body
            }
        );

        return await response.json() as TResult;
    }
}
